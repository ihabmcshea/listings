import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

/**
 * Handles password change requests.
 *
 * Validates the provided current password, updates the user's password if valid,
 * and saves the new password after hashing it.
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordNew } = req.body;
  const { id, name } = req.jwtPayload;

  const userRepository = getRepository(User);
  try {
    // Find the user by ID
    const user = await userRepository.findOne({ where: { id } });

    // Handle case where user is not found
    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', [`User ${name} not found.`]);
      return next(customError);
    }

    // Verify the current password
    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(400, 'General', 'Invalid Password', ['Incorrect password']);
      return next(customError);
    }

    // Update and hash the new password
    user.password = passwordNew;
    user.hashPassword();
    await userRepository.save(user);

    // Send success response
    res.customSuccess(200, 'Password successfully changed.');
  } catch (err) {
    // Handle errors
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
