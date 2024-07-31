import { Router } from 'express';

import { create, publishDraft } from 'controllers/listings';
import { addPhotosToListing } from 'controllers/listings/addPhotos';
import { showListing, showListings } from 'controllers/listings/list';
import { checkJwt } from 'middleware/checkJwt';
import { validateCreate } from 'middleware/validation/listings/create';
import { validateEdit } from 'middleware/validation/listings/validateEdit';
import { listingsUpload } from 'utils/upload';

const router = Router();

router.post('/create', [checkJwt, validateCreate], create);
router.post('/:listing_id/publish', [checkJwt, validateEdit], publishDraft);
router.get('/list', showListings);
router.get('/listing/:id', showListing);
router.post('/:listing_id/add-photos', [checkJwt, validateEdit, listingsUpload], addPhotosToListing);

export default router;
