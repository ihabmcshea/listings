import { Router } from 'express';

import { create } from 'controllers/listings';
import { showListing, showListings } from 'controllers/listings/list';
import { checkJwt } from 'middleware/checkJwt';
import { validateCreate } from 'middleware/validation/listings/create';

const router = Router();

router.post('/create', [checkJwt, validateCreate], create);
router.get('/list', showListings);
router.get('/listing/:id', showListing);

export default router;
