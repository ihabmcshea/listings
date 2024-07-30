import { Router } from 'express';

import auth from './auth';
import cities from './cities';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/cities', cities);

export default router;
