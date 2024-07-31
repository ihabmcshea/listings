import 'dotenv/config';
import path from 'path';

import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { checkFileType } from 'middleware/validation/imageUploads';
import { IFile } from 'types/File';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
const UPLOAD_PATH = process.env.UPLOAD_PATH;

const generateFileUuuid = (file) => {
  const fileuuid = uuidv4() + Date.now();
  // get the filename extension from the original file name
  const uuidFilenameExtension = file.originalname.split('.').pop();
  // construct a new filename based on the uuid and preserve the
  // original extension
  const uuidFilename = fileuuid + '.' + uuidFilenameExtension;
  return uuidFilename;
};

const listingStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${UPLOAD_PATH}/listings`);
  },
  filename: function (req, file, cb) {
    const fileName = generateFileUuuid(file);
    cb(null, fileName);
  },
});

const usersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '/public/users');
    cb(null, `src/public/users`);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileUuuid(file);
    cb(null, fileName);
  },
});

const listingsUpload = multer({ storage: listingStorage, fileFilter: checkFileType });
const usersUpload = multer({ storage: usersStorage }).single('profile_picture');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/public/');
  },
  filename: (req, file, cb) => {
    const fileName = generateFileUuuid(file);
    cb(null, fileName);
  },
});

// Create the multer instance
const upload_ = multer({ storage: storage }).single('profile_picture');
export { listingsUpload, usersUpload, upload_ };
