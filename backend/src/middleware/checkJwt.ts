import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload } from '../types/JwtPayload';
import { createJwtToken } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the Authorization header
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(new CustomError(400, 'General', 'Authorization header not provided'));
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new CustomError(400, 'General', 'Token not provided in Authorization header'));
  }

  try {
    // Verify the token
    const jwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.jwtPayload = jwtPayload;

    // Refresh and send a new token on every request
    const newToken = createJwtToken(jwtPayload);
    res.setHeader('Authorization', `Bearer ${newToken}`);

    return next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new CustomError(401, 'Raw', 'JWT error', null, err));
    }
    return next(new CustomError(400, 'Raw', "Token can't be created", null, err));
  }
};
