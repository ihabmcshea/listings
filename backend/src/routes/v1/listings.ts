import { Router } from 'express';

import { createListing, publishDraft } from 'controllers/listings';
import { addPhotosToListing } from 'controllers/listings/addPhotos';
import { showListing, showListings } from 'controllers/listings/list';
import { checkJwt } from 'middleware/checkJwt';
import { validateCreateListing } from 'middleware/validation/listings/create';
import { validateEdit } from 'middleware/validation/listings/validateEdit';
import { listingsUpload, multerErrorHandler } from 'middleware/upload';

const router = Router();

router.post('/create', [checkJwt, validateCreateListing], createListing);
router.post('/:listing_id/publish', [checkJwt, validateEdit], publishDraft);
router.get('/list', showListings);
router.get('/listing/:id', showListing);
router.post(
  '/:listing_id/add-photos',
  [checkJwt, validateEdit, listingsUpload, multerErrorHandler],
  addPhotosToListing,
);

export default router;
