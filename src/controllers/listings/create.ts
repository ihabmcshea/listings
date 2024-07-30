import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, rooms, bathrooms, city, long, lat, location } = req.body;
  const { id, name } = req.jwtPayload;

  try {
    const newListing = new Listing();
    newListing.title = title;
    newListing.description = description;
    newListing.rooms = rooms;
    newListing.bathrooms = bathrooms;
    newListing.city = city;
    const cityRepository = getRepository(City);
    const currentCity = cityRepository.findOne(city);
    if (!currentCity) {
      const cityNotFoundError = new CustomError(400, 'Validation', "City doesn't exist");
      return next(cityNotFoundError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
