import "dotenv/config";
import path from "path";

import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";

// Utility function to get path without prefixes
const getPathWithoutPrefixes = (filePath: string): string => {
  return `public/${filePath.split("/public/")[1]}`;
};

// Function to generate a unique filename for each file
const generateFileUuid = (file: Express.Multer.File): string => {
  const fileUuid = uuidv4() + Date.now();
  const fileExtension = path.extname(file.originalname);
  return `${fileUuid}${fileExtension}`;
};

// File type validation function
const checkFileType = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const fileTypes = /jpeg|jpg|webp|heic|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Unsupported file type") as any, false); // Reject the file
  }
};
// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Middleware for handling multer errors
const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific error handling
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res
          .status(400)
          .json({ error: "File size exceeds the limit of 5MB" });
      case "LIMIT_FILE_COUNT":
        return res
          .status(400)
          .json({ error: "Number of files exceeds the limit of 8" });
      default:
        return res.status(400).json({ error: `Multer error: ${err.message}` });
    }
  } else if (err) {
    // General error handling
    return res.status(400).json({ error: err.message });
  } else {
    // If no error, proceed
    return next();
  }
};
// Storage configuration for listing photos
const listingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = path.join(__dirname, "../public/listings");
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileUuid(file);
    cb(null, fileName);
  },
});

// Storage configuration for user profile pictures
const usersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = path.join(__dirname, "../public/users");
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileUuid(file);
    cb(null, fileName);
  },
});

// Middleware for uploading multiple files (listings)
const listingsUpload = multer({
  storage: listingStorage,
  fileFilter: checkFileType,
  limits: { fileSize: MAX_FILE_SIZE, files: 8 }, // Maximum of 8 files
}).array("photos", 8);

// Middleware for uploading a single file (user profile picture)
const usersUpload = multer({
  storage: usersStorage,
  fileFilter: checkFileType,
  limits: { fileSize: MAX_FILE_SIZE }, // Maximum file size
}).single("profile_picture");

// Exporting the middlewares and the error handler
export {
  listingsUpload,
  usersUpload,
  getPathWithoutPrefixes,
  multerErrorHandler,
};
