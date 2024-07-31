import { Router } from 'express';

import { create } from 'controllers/listings';
import { showListings } from 'controllers/listings/list';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.get('/list', showListings);

export default router;
