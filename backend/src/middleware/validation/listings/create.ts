import { Request, Response, NextFunction } from 'express';
import { ListingType, Ownership } from 'orm/entities/listings/types';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

/**
 * Middleware to validate required fields for creating a listing.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const validateCreateListing = (req: Request, res: Response, next: NextFunction) => {
  const { listing_type, ownership } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  // Validate listing_type
  if (!Object.values(ListingType).includes(listing_type)) {
    errorsValidation.push({ listing_type: 'Listing Type is invalid' });
  }

  // Validate ownership
  if (!Object.values(Ownership).includes(ownership)) {
    errorsValidation.push({ ownership: 'Ownership value is invalid' });
  }

  // If there are validation errors, respond with an error
  if (errorsValidation.length > 0) {
    const validationError = new CustomError(
      400,
      'Validation',
      'Create listing validation error',
      null,
      null,
      errorsValidation,
    );
    return next(validationError);
  }

  next(); // Proceed to the next middleware or route handler
};
