import { Router } from 'express';

import { login, register, changePassword, changePhoto } from 'controllers/auth';
import { checkJwt } from 'middleware/checkJwt';
import { validatorLogin, validatorRegister, validatorChangePassword } from 'middleware/validation/auth';
import { usersUpload } from 'utils/upload';

const router = Router();

router.post('/login', [validatorLogin], login);
router.post('/register', [validatorRegister], register);
router.post('/change-password', [checkJwt, validatorChangePassword], changePassword);
router.post('/change-photo', [checkJwt, usersUpload], changePhoto);

export default router;
