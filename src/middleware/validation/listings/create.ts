import { Request, Response, NextFunction } from 'express';

import { ListingType, Ownership } from 'orm/entities/listings/types';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validateCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { listing_type, ownership } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  if (!Object.values(ListingType).includes(listing_type)) {
    errorsValidation.push({ listing_type: 'Listing Type is invalid' });
  }
  if (!Object.values(Ownership).includes(ownership)) {
    errorsValidation.push({ ownership: 'Ownership value is invalid' });
  }
  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create listing validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  next();
};
