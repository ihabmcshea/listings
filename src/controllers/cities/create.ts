import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, country, lat, long } = req.body;
  const cityRepository = getRepository(City);
  try {
    const city = cityRepository.findOne({ name, country });
    if (city) {
      const cityExists = new CustomError(400, 'Validation', 'City already exists');
      return next(cityExists);
    }
    try {
      const newCity = new City();
      newCity.name = name;
      newCity.country = country;
      newCity.coordinates = new Point(lat, long);
      await cityRepository.save(newCity);
      return res.customSuccess(200, 'City successfully created.');
    } catch (err) {
      const customError = new CustomError(400, 'Raw', 'Error', null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
