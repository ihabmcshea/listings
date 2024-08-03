import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { getPathWithoutPrefixes } from "middleware/upload";
import { User } from "orm/entities/users/User";
import { MulterRequest } from "types/File";
import { CustomError } from "utils/response/custom-error/CustomError";

export const changePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const image = (req as unknown as MulterRequest).file;
  const { id } = req.jwtPayload;
  try {
    const userRepository = getRepository(User);
    const currentUser = await userRepository.findOne(id);

    currentUser.profilePictureURL = getPathWithoutPrefixes(image.path);
    await userRepository.save(currentUser);
    res.status(200).send();
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
