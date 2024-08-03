import { Request, Response } from 'express';

import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

/**
 * API endpoint to refresh the JWT token.
 *
 * This endpoint creates a new JWT token using the payload from the existing token.
 * The new token is returned in the response. This endpoint should be called
 * whenever the token needs to be refreshed, typically when a request is made
 * with an expiring token.
 *
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Ensure that `req.jwtPayload` is available, set by previous middleware
    const jwtPayload = req.jwtPayload;

    if (!jwtPayload) {
      // If no payload is present, respond with an error
      throw new CustomError(401, 'Raw', 'JWT payload missing');
    }

    // Create a new JWT token using the payload
    const newToken = createJwtToken(jwtPayload);

    // Send the new token in the response
    return res.status(200).json({
      message: 'Token refreshed',
      token: newToken,
    });
  } catch (err) {
    // Handle errors and send an appropriate response
    return res.status(401).json({
      error: 'Token refresh failed',
      details: err.message,
    });
  }
};
