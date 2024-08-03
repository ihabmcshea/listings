import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

/**
 * Handles user login by validating credentials and generating a JWT token.
 *
 * 1. Validates the user's email and password.
 * 2. If credentials are correct, generates a JWT token.
 * 3. Returns the token and user information in the response.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userRepository = getRepository(User);
  try {
    // Find the user by email
    const user = await userRepository.findOne({ where: { email } });

    // Handle case where user is not found
    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
      return next(customError);
    }

    // Verify the provided password
    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
      return next(customError);
    }

    // Create JWT payload
    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      created_at: user.created_at,
    };

    try {
      // Generate JWT token
      const token = createJwtToken(jwtPayload);
      // Respond with token and user info
      res.customSuccess(200, 'Token successfully created.', {
        token,
        user,
      });
    } catch (err) {
      // Handle token creation errors
      const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
      return next(customError);
    }
  } catch (err) {
    // Handle errors during user retrieval and validation
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
