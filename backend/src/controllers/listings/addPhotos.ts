import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { getPathWithoutPrefixes } from 'middleware/upload';
import { Listing } from 'orm/entities/listings/Listing';
import { Photo } from 'orm/entities/photos/Photo';
import { MulterRequest } from 'types/File';
import { CustomError } from 'utils/response/custom-error/CustomError';

/**
 * Adds photos to a listing. Each listing can have a maximum of 8 photos.
 *
 * 1. Retrieves the listing by its ID from the request parameters.
 * 2. Checks if the number of photos for the listing has reached the limit of 8.
 * 3. If the limit is not reached, saves each photo associated with the listing.
 * 4. Responds with a success message if all photos are added successfully.
 */
export const addPhotosToListing = async (req: Request, res: Response, next: NextFunction) => {
  const { listing_id } = req.params; // Listing ID from the request parameters
  const photos = (req as unknown as MulterRequest).files; // Photos from the request (MulterRequest)

  const listingRepository = getRepository(Listing); // Repository for the Listing entity
  const listing = await listingRepository.findOne(listing_id); // Find the listing by ID

  // Check if the listing exists
  if (!listing) {
    const customError = new CustomError(404, 'General', 'Listing not found');
    return next(customError);
  }

  const photoRepository = getRepository(Photo); // Repository for the Photo entity

  try {
    // Process each photo
    for (const photo of photos) {
      // Count the current number of photos for the listing
      const listingPhotosCount = await photoRepository.count({
        where: { listing },
      });

      // Check if the photo limit has been reached
      if (listingPhotosCount >= 8) {
        const customError = new CustomError(400, 'Raw', 'Error', null, {
          photoLimitReached: 'A limit of 8 photos per listing is exceeded',
        });
        return next(customError);
      }

      // Create and save the new photo
      const listingPhoto = new Photo();
      listingPhoto.listing = listing;
      const clearPath = getPathWithoutPrefixes(photo.path); // Clean path for the photo
      listingPhoto.url = clearPath;
      await photoRepository.save(listingPhoto);
    }

    // Respond with a success message
    res.customSuccess(200, 'Photos successfully added.');
  } catch (err) {
    // Handle any errors that occur during photo processing
    const customError = new CustomError(400, 'Raw', 'Error', null, { err });
    return next(customError);
  }
};
