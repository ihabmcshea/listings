import { Router } from 'express';

import { create, listCities } from 'controllers/cities';
import { checkJwt } from 'middleware/checkJwt';
import { validateCityCreation } from 'middleware/validation/cities';

const router = Router();

router.post('/create', [checkJwt, validateCityCreation], create);
router.get('/list', listCities);

export default router;
