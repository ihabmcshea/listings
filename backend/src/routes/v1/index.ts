import { Router } from 'express';

import auth from './auth';
import cities from './cities';
import listings from './listings';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/cities', cities);
router.use('/listings', listings);

export default router;
