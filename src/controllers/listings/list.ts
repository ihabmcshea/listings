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
  const skip = listingsPerPage * page;
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
      coordinates: [long, lat],
    };
    const [listingsNearby, total] = await listingRepository
      .createQueryBuilder('listing')
      .select([
        '*',
        'ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance',
      ])
      .where('ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)')
      .orderBy('distance', 'ASC')
      .setParameters({
        // stringify GeoJSON
        origin: JSON.stringify(origin),
        range: radius * 1000, //KM conversion
      })
      .getManyAndCount();
    const pages = Math.min(total / listingsPerPage);
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
