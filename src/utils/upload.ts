import 'dotenv/config';
import { checkFileType } from 'middleware/validation/imageUploads';
import * as multer from 'multer';

const UPLOAD_PATH = process.env.UPLOAD_PATH;

const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: checkFileType });

export { upload };