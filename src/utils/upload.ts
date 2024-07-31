import 'dotenv/config';
import * as multer from 'multer';

import { checkFileType } from 'middleware/validation/imageUploads';

const UPLOAD_PATH = process.env.UPLOAD_PATH;

const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: checkFileType });

export { upload };
