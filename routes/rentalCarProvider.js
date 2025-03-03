const express = require('express');
const {
  getRentalCarProviders,
  getRentalCarProvider,
  createRentalCarProvider,
  updateRentalCarProvider,
  deleteRentalCarProvider
} = require('../controllers/rentalCarProvider');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
// const appointmentsRouter = require('./appointments');

// router
//   .use('/:hospitalId/appointments/', appointmentsRouter);
router.route('/')
  .get(getRentalCarProviders)
  .post(createRentalCarProvider)
  .post(protect, authorize('admin'), createRentalCarProvider);
router.route('/:id')
  .get(getRentalCarProvider)
  // .put(updateRentalCarProvider)
  // .delete(deleteRentalCarProvider);
  .put(protect, authorize('admin'), updateRentalCarProvider)
  .delete(protect, authorize('admin'), deleteRentalCarProvider);

module.exports = router;


