import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
import { ListingType } from 'orm/entities/listings/types';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, rooms, bathrooms, city_id, furnished, listing_type, ownership, long, lat, location } =
    req.body;
  const { id } = req.jwtPayload;
  // res.status(200).send({body: req.body})
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id });
    if (!user) {
      const cityNotFoundError = new CustomError(400, 'Validation', 'Error fetching user data');
      return next(cityNotFoundError);
    }
    const cityRepository = getRepository(City);
    const city = await cityRepository.findOne({ id: city_id });
    if (!city) {
      const cityNotFoundError = new CustomError(400, 'Validation', "City doesn't exist");
      return next(cityNotFoundError);
    }
    const listingRepository = getRepository(Listing);

    const newListing = new Listing();
    newListing.title = title;
    newListing.description = description;
    newListing.rooms = rooms;
    newListing.bathrooms = bathrooms;
    newListing.city = city;
    const coordinates: Point = {
      type: 'Point',
      coordinates: [lat, long],
    };
    newListing.coordinates = coordinates;
    newListing.location = location;
    newListing.furnished = furnished;
    newListing.listingType = listing_type;
    newListing.ownership = ownership;
    newListing.status = 'Available';

    newListing.user = user;

    await listingRepository.save(newListing);
    res.customSuccess(200, 'Listing successfully created.');
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
