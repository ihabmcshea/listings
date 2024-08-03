import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { getPathWithoutPrefixes } from 'middleware/upload';
import { User } from 'orm/entities/users/User';
import { MulterRequest } from 'types/File';
import { CustomError } from 'utils/response/custom-error/CustomError';

/**
 * Handler for changing the user's profile photo.
 *
 * This endpoint allows a user to update their profile picture. It expects a file
 * to be uploaded in the request, and it updates the `profilePictureURL` field of
 * the user in the database with the new file path.
 *
 */
export const changePhoto = async (req: Request, res: Response, next: NextFunction) => {
  // Extract the uploaded file from the request. The request is cast to `MulterRequest` to access the file.
  const image = (req as unknown as MulterRequest).file;

  // Extract user ID from the JWT payload. This ID identifies the user whose profile picture will be updated.
  const { id } = req.jwtPayload;

  try {
    // Get the user repository from TypeORM to interact with the User entity.
    const userRepository = getRepository(User);

    // Find the current user in the database using the extracted ID.
    const currentUser = await userRepository.findOne(id);

    if (!currentUser) {
      // If no user is found, throw a custom error indicating that the user does not exist.
      throw new CustomError(404, 'Raw', 'User not found');
    }

    // Update the profile picture URL of the user. `getPathWithoutPrefixes` is used to clean the file path.
    currentUser.profilePictureURL = getPathWithoutPrefixes(image.path);

    // Save the updated user entity back to the database.
    await userRepository.save(currentUser);

    // Send a 200 status response indicating that the update was successful.
    res.customSuccess(200, 'Profile photo changed');
  } catch (err) {
    // Handle errors by creating a custom error and passing it to the next middleware.
    const customError = new CustomError(400, 'Raw', 'Error updating profile picture', null, err);
    return next(customError);
  }
};
