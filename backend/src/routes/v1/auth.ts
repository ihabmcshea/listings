import { Router } from 'express';

import { login, register, changePassword, changePhoto, refreshToken } from 'controllers/auth';
import { checkJwt } from 'middleware/checkJwt';
import { multerErrorHandler, usersUpload } from 'middleware/upload';
import { validatorLogin, validatorRegister, validatorChangePassword } from 'middleware/validation/auth';

const router = Router();

router.post('/login', [validatorLogin], login);
router.post('/register', [validatorRegister], register);
router.post('/change-password', [checkJwt, validatorChangePassword], changePassword);
router.post('/refresh-token', [checkJwt], refreshToken);
router.post('/change-photo', [checkJwt, usersUpload, multerErrorHandler], changePhoto);

export default router;
