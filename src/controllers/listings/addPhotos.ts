import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { City } from 'orm/entities/cities/City';
import { Listing } from 'orm/entities/listings/Listing';
import { ListingType } from 'orm/entities/listings/types';
import { Photo } from 'orm/entities/photos/Photo';
import { User } from 'orm/entities/users/User';
import { MulterRequest } from 'types/File';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { getPathWithoutPrefixes } from 'utils/upload';

export const addPhotosToListing = async (req: Request, res: Response, next: NextFunction) => {
  const { listing_id } = req.params;
  const photos = (req as unknown as MulterRequest).files;
  const listingRepository = getRepository(Listing);

  const listing = await listingRepository.findOne(listing_id);
  const photoRepository = getRepository(Photo);
  try {
    photos.forEach(async (photo) => {
      const listingPhotosCount = await photoRepository.count({
        where: { listing },
      });
      if (listingPhotosCount >= 8) {
        const customError = new CustomError(400, 'Raw', 'Error', null, {
          photoLimitReached: 'A limit of 8 photos per listing is exceeded',
        });
        return next(customError);
      }
      const listingPhoto = new Photo();
      listingPhoto.listing = listing;
      const clearPath = getPathWithoutPrefixes(photo.path);
      listingPhoto.url = clearPath;
      await photoRepository.save(listingPhoto);
    });
    res.customSuccess(200, 'Photos successfully added.');
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, { err });
    return next(customError);
  }
};
