import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';

/**
 * Middleware to validate required fields for creating a city.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const validateCityCreation = (req: Request, res: Response, next: NextFunction) => {
  const { name, country, lat, long } = req.body;

  // Check for missing required fields
  if (!name || !country || !lat || !long) {
    const validationError = new CustomError(400, 'Validation', 'Missing required fields: name, country, lat, or long.');
    return next(validationError);
  }

  next(); // Proceed to the next middleware or route handler
};
