import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { listingsPerPage } from 'consts/ConstsListing';
import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
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
        '*',
        'ST_Distance(coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(coordinates)))/1000 AS distance',
      ])
      .where('ST_DWithin(coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(coordinates)) ,:range)')
      .orderBy('distance', 'ASC')
      .setParameters({
        // stringify GeoJSON
        origin: JSON.stringify(origin),
        range: radius * 1000, //KM conversion
      })
      .getRawMany();

    const total = await listingRepository
      .createQueryBuilder('listing')
      .select([
        '*',
        'ST_Distance(coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(coordinates)))/1000 AS distance',
      ])
      .where('ST_DWithin(coordinates, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(coordinates)) ,:range)')
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
    .getOne();

  res.status(200).send({ listing });
};
