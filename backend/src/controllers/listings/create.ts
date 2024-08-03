import { Request, Response, NextFunction } from 'express';
import { Point } from 'geojson';
import { getRepository } from 'typeorm';

import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
import { Status } from 'orm/entities/listings/types';
import { User } from 'orm/entities/users/User';
import { indexListing } from 'utils/elasticSearchUtils';
import { CustomError } from 'utils/response/custom-error/CustomError';

import redis from '../../clients/redisClient';

/**
 * Creates a new listing in the database.
 *
 * @returns A success message if the listing is created successfully, or an error message if something goes wrong.
 */
export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, rooms, bathrooms, city_id, furnished, listing_type, ownership, long, lat, location } =
    req.body;
  const userId = req.jwtPayload?.id;

  // Validate user ID from JWT payload
  if (!userId) {
    const error = new CustomError(400, 'Validation', 'User ID is missing from the request');
    return next(error);
  }

  try {
    const [user, city] = await Promise.all([
      getRepository(User).findOne({ id: userId }),
      getRepository(City).findOne({ id: city_id }),
    ]);

    if (!user) {
      const error = new CustomError(400, 'Validation', 'User not found');
      return next(error);
    }

    if (!city) {
      const error = new CustomError(400, 'Validation', 'City not found');
      return next(error);
    }

    const listingRepository = getRepository(Listing);

    const newListing = new Listing();
    newListing.title = title;
    newListing.description = description;
    newListing.rooms = rooms;
    newListing.bathrooms = bathrooms;
    newListing.city = city;
    newListing.location = location;
    newListing.furnished = furnished;
    newListing.listingType = listing_type;
    newListing.ownership = ownership;
    newListing.status = Status.AVAILABLE;
    newListing.user = user;

    // Create coordinates point
    newListing.coordinates = {
      type: 'Point',
      coordinates: [long, lat],
    } as Point;

    redis.geoadd('listings', newListing.coordinates.longitude, newListing.coordinates.latitude, newListing.id);

    indexListing(newListing);
    await listingRepository.save(newListing);

    return res.status(201).json({
      status: 'success',
      message: 'Listing successfully created.',
      listing: newListing,
    });
  } catch (err) {
    const error = new CustomError(500, 'Raw', 'Error occurred while creating the listing', null, err);
    return next(error);
  }
};

/**
 * Publishes a draft listing by setting its draft status to false.
 *
 * @param req - The request object containing the listing ID in the URL parameters.
 * @param res - The response object used to send the response.
 * @param next - The next middleware function for error handling.
 *
 * @returns A success message if the listing is published successfully, or an error message if something goes wrong.
 */
export const publishDraft = async (req: Request, res: Response, next: NextFunction) => {
  const { listing_id } = req.params;

  // Validate the listing_id
  if (!listing_id) {
    const error = new CustomError(400, 'Validation', 'Listing ID is required');
    return next(error);
  }

  try {
    const listingRepository = getRepository(Listing);

    // Attempt to update the draft status of the listing
    const result = await listingRepository.update(listing_id, { draft: false });

    // Check if the update operation affected any rows
    if (result.affected === 0) {
      const error = new CustomError(404, 'NotFound', 'Listing not found');
      return next(error);
    }

    // Send a success response
    return res.status(200).json({
      status: 'success',
      message: 'Listing published successfully',
    });
  } catch (err) {
    // Handle unexpected errors
    const error = new CustomError(500, 'Raw', 'Error occurred while publishing the listing', null, err);
    return next(error);
  }
};
