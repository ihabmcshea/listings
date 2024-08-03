import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { listingsPerPage } from 'consts/ConstsListing';
import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
import { Photo } from 'orm/entities/photos/Photo';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { ListingWithDistance, PaginatedListings } from './interfaces';

/**
 * Shows all listings in a certain city or near certain coordinates.
 * Returns the listing with associated user details and an array of its photos.
 */
export const showListings = async (req: Request, res: Response, next: NextFunction) => {
  const city = Number(req.query.city);
  const page = Number(req.query.page) || 1;
  const long = Number(req.query.long);
  const lat = Number(req.query.lat);
  const radius = Number(req.params.radius) || 5;
  const pageAsNumber = Number(page);
  const skip = listingsPerPage * (pageAsNumber - 1);
  const listingRepository = getRepository(Listing);

  try {
    if (city && !(long && lat && radius)) {
      // Fetch listings by city with pagination
      const [listingData, total] = await listingRepository.findAndCount({
        where: { city, draft: false },
        take: listingsPerPage,
        skip,
        relations: ['photos', 'user', 'city'], // Include user, city, and photos in the result
      });
      const pages = Math.ceil(total / listingsPerPage);
      const listings: PaginatedListings = {
        total: Number(total),
        listings: listingData,
        page,
        pages,
        limit: listingsPerPage,
      };
      console.log(listings);
      return res.customSuccess(200, 'Listings retrieved', listings);
    } else if (long && lat && radius) {
      // Coordinates provided; perform a geospatial query
      const origin: Point = { type: 'Point', coordinates: [long, lat] };
      const originGeoJson = JSON.stringify(origin);
      const rangeMeters = radius * 1000;
      const [data, total] = await Promise.all([
        listingRepository
          .createQueryBuilder('listing')
          .select([
            'listing.id',
            'listing.title',
            'listing.description',
            'listing.coordinates',
            'user.name',
            'user.description',
            'city.name',
            'photo.id',
            'photo.url',
            'photo.height',
            'photo.width',
            'photo.created_at',
            'photo.updated_at',
            'photo.listing_id',
            'ST_Distance(listing.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), 4326)) AS distance',
          ])
          .leftJoin('listing.user', 'user')
          .leftJoin('listing.city', 'city')
          .leftJoin('listing.photos', 'photo')
          .where(
            'ST_DWithin(listing.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), 4326), :range) AND listing.draft = false',
          )
          .orderBy('distance', 'ASC')
          .addOrderBy('listing.id', 'ASC') // Ensure consistent ordering
          .setParameters({
            origin: originGeoJson,
            range: rangeMeters, // Convert radius to meters
          })
          .limit(listingsPerPage)
          .offset(skip)
          .getRawAndEntities(),
        listingRepository
          .createQueryBuilder('listing')
          .select('COUNT(DISTINCT listing.id)', 'count')
          .innerJoin(User, 'user', 'listing.user_id = user.id')
          .innerJoin(City, 'city', 'listing.city_id = city.id')
          .where(
            'ST_DWithin(listing.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(listing.coordinates)), :range) AND listing.draft IS NOT TRUE',
          )
          .setParameters({
            origin: originGeoJson,
            range: rangeMeters,
          })
          .getRawOne(),
      ]);
      const rawData = data.raw;
      const listingsWithDistance = data.entities.map((listing: ListingWithDistance, index: number) => ({
        ...listing,
        distance: Number(rawData[index].distance / 1000), // Ensure distance is a number
      }));

      const pages = Math.ceil(Number(total.count) / listingsPerPage);
      const listings: PaginatedListings = {
        total: Number(total.count),
        listings: listingsWithDistance,
        page,
        pages,
        limit: listingsPerPage,
      };
      return res.customSuccess(200, 'Listings retrieved', listings);
    } else {
      // Handle case with no filters
      const [data, total] = await listingRepository.findAndCount({
        where: { draft: false },
        take: listingsPerPage,
        skip,
        relations: ['photos', 'user', 'city'], // Include user, city, and photos in the result
      });
      const pages = Math.ceil(total / listingsPerPage);
      return res.customSuccess(200, 'Listings retrieved', {
        total,
        listings: data.map((listing) => ({
          ...listing,
          photos: listing.photos || [],
        })),
        page,
        pages,
        limit: listingsPerPage,
      });
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error retrieving listings', null, err);
    return next(customError);
  }
};

export const showMyDrafts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const { id } = req.jwtPayload;
  const pageAsNumber = Number(page);
  const skip = listingsPerPage * (pageAsNumber - 1);
  const listingRepository = getRepository(Listing);
  try {
    const [data, total] = await listingRepository.findAndCount({
      where: { draft: true, user_id: id },
      take: listingsPerPage,
      skip,
      relations: ['photos', 'city'], // Include user, city, and photos in the result
    });
    const pages = Math.ceil(total / listingsPerPage);
    return res.customSuccess(200, 'Listings retrieved', {
      total,
      listings: data.map((listing) => ({
        ...listing,
        photos: listing.photos || [],
      })),
      page,
      pages,
      limit: listingsPerPage,
    });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error retrieving listings', null, err);
    return next(customError);
  }
};

export const getMyDraftCount = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.jwtPayload;
  const listingRepository = getRepository(Listing);
  try {
    const total = await listingRepository.count({
      where: { draft: true, user_id: id },
    });
    return res.customSuccess(200, 'Draft listings count retrieved', {
      total,
    });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error retrieving draft listings count', null, err);
    return next(customError);
  }
};

export const showListing = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const listingRepository = getRepository(Listing);

  try {
    // Fetch the listing along with related user, city, and photos
    const listing = await listingRepository
      .createQueryBuilder('listing')
      .where('listing.id = :id', { id })
      .leftJoinAndSelect('listing.user', 'user')
      .leftJoinAndSelect('listing.city', 'city')
      .leftJoinAndSelect('listing.photos', 'photos')
      .getOne();

    // Handle case where listing is not found
    if (!listing) {
      const notFoundError = new CustomError(404, 'NotFound', 'Listing not found');
      return next(notFoundError);
    }

    // Return the listing data
    res.customSuccess(200, 'Listing retrieved', { listing });
  } catch (err) {
    // Handle any unexpected errors
    const customError = new CustomError(500, 'Raw', 'Error retrieving listing', null, err);
    return next(customError);
  }
};
