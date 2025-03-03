const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking }
  = require('../controllers/booking');

// console.log('getAppointments:', getAppointments); // Debugging

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getBookings)
  .post(protect, authorize('admin', 'user'), createBooking);
router.route('/:id')
  .get(protect,getBooking)
  .put(protect, authorize('admin', 'user'), updateBooking)
  .delete(protect, authorize('admin', 'user'), deleteBooking);
// router.route('/hospitals').post(addAppointment);

module.exports = router;
