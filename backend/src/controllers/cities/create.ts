import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { City } from 'orm/entities/cities/City';
import { CustomError } from 'utils/response/custom-error/CustomError';

/**
 * Creates a new city in the database.
 *
 * @returns A success message if the city is created successfully, or an error message if something goes wrong.
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, country, lat, long } = req.body;
  const cityRepository = getRepository(City);

  try {
    // Check if the city already exists
    const existingCity = await cityRepository.findOne({
      where: { name, country },
    });
    if (existingCity) {
      const cityExistsError = new CustomError(400, 'Validation', 'City already exists.');
      return next(cityExistsError);
    }

    // Create and save the new city
    const newCity = new City();
    newCity.name = name;
    newCity.country = country;
    newCity.coordinates = {
      type: 'Point',
      coordinates: [long, lat],
    } as Point;

    await cityRepository.save(newCity);

    // Respond with success message
    return res.status(201).json({
      status: 'success',
      message: 'City successfully created.',
      city: newCity, // Optionally return the created city object
    });
  } catch (err) {
    // Handle unexpected errors
    const customError = new CustomError(500, 'Raw', 'Error occurred while creating the city.', null, err);
    return next(customError);
  }
};
