import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Listing } from 'orm/entities/listings/Listing';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const validateEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { listing_id } = req.params;
  const { id } = req.jwtPayload;
  const listingRepository = getRepository(Listing);
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(id);

  const listing = await listingRepository.findOne({
    where: { id: listing_id },
    relations: ['user'],
  });

  if (listing && listing.user.id !== id && user.role !== 'Admin') {
    const customError = new CustomError(400, 'Unauthorized', 'Unauthorized to edit', null, null, [
      { unauthorized: 'Editting a listing not yours isnt allowed' },
    ]);
    return next(customError);
  }
  return next();
};
