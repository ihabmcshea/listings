import 'dotenv/config';
import path from 'path';

import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { checkFileType } from 'middleware/validation/imageUploads';

const getPathWithoutPrefixes = (path: string): string => {
  return `public/${path.split('/public/')[1]}`;
};

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
    const destination = path.join(__dirname, '../public/listings');
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const fileName = generateFileUuuid(file);
    cb(null, fileName);
  },
});

const usersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const uploadDir = process.env.UPLOAD_PATH;
    const destination = path.join(__dirname, '../public/users');
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileUuuid(file);
    cb(null, fileName);
  },
});

const listingsUpload = multer({ storage: listingStorage }).array('photos', 8);
const usersUpload = multer({ storage: usersStorage }).single('profile_picture');

export { listingsUpload, usersUpload, getPathWithoutPrefixes };
