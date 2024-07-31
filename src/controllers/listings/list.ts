import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { listingsPerPage } from 'consts/ConstsListing';
import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
import { Photo } from 'orm/entities/photos/Photo';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { PaginatedListings } from './interfaces';

export const showListings = async (req: Request, res: Response, next: NextFunction) => {
  const { city, long, lat, radius = 5, page = 1 } = req.body;
  const skip = listingsPerPage * (page - 1);
  const listingRepository = getRepository(Listing);
  let listings: PaginatedListings;
  if (city && !(long && lat && radius)) {
    const [data, total] = await listingRepository.findAndCount({
      where: {
        city,
        draft: false,
      },
      take: listingsPerPage,
      skip,
    });
    const pages = Math.min(total / listingsPerPage);
    listings = {
      total,
      listings: data,
      page,
      pages,
      limit: listingsPerPage,
    };
  } else if (long && lat && radius) {
    const origin = {
      type: 'Point',
      coordinates: [lat, long],
    };
    const listingsNearby = await listingRepository
      .createQueryBuilder('listing')
      .select([
        'listing.id',
        'listing.title',
        'listing.description',
        'user.name',
        'user.description',
        'city.name',
        'ST_Distance(listing.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(listing.coordinates)))/1000 AS distance',
      ])
      .where(
        'ST_DWithin(listing.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(listing.coordinates)) ,:range) AND draft IS NOT TRUE',
      )
      .innerJoin(User, 'user', 'listing.user_id = user.id')
      .innerJoin(City, 'city', 'listing.city_id = city.id')
      .leftJoinAndMapMany('listing.photos', Photo, 'photo', 'photo.listing_id = listing.id')
      .orderBy('distance', 'ASC')
      .setParameters({
        // stringify GeoJSON
        origin: JSON.stringify(origin),
        range: radius * 1000, //KM conversion
      })
      .getMany();

    const total = await listingRepository
      .createQueryBuilder('listing')
      .select([
        '*',
        'ST_Distance(listing.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(listing.coordinates)))/1000 AS distance',
      ])
      .where(
        'ST_DWithin(listing.coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(listing.coordinates)) ,:range)',
      )
      .leftJoinAndSelect('listing.user', 'user')
      .select(['user.name', 'user.description', 'user.profile_picture_url'])
      .leftJoinAndSelect('listing.city', 'city')
      .leftJoinAndMapMany('listing.photos', Photo, 'photo', 'photo.listing_id = listing.id')
      .orderBy('distance', 'ASC')
      .setParameters({
        // stringify GeoJSON
        origin: JSON.stringify(origin),
        range: radius * 1000, //KM conversion
      })
      .getCount();
    const pages = Math.ceil(total / listingsPerPage);
    listings = {
      total,
      listings: listingsNearby,
      page,
      pages,
      limit: listingsPerPage,
    };
  } else {
    const customError = new CustomError(400, 'Validation', 'No city or coordinates provided', null, null, [
      { parameter_error: 'No city or coordinates provided' },
    ]);
    return res.status(400).send(customError);
  }
  return res.status(200).send(listings);
};

export const showListing = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const listingRepository = getRepository(Listing);
  const listing = await listingRepository
    .createQueryBuilder('listing')
    .where({ id })
    .leftJoinAndSelect('listing.user', 'user')
    .leftJoinAndSelect('listing.city', 'city')
    .leftJoinAndSelect('listing.photos', 'photos')
    .getOne();

  res.status(200).send({ listing });
};
