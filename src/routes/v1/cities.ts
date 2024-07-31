import { Router } from 'express';

import { create, listCities } from 'controllers/cities';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.get('/list', listCities);

export default router;
