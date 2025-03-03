const Booking = require('../models/Booking.js');
const RentalCarProvider = require('../models/RentalCarProvider.js');
const User = require('../models/User.js');

// @desc    Create a booking (User can book up to 3 cars)
// @route   POST /RentalC01/booking
// @access  Private (Registered Users)
exports.createBooking = async (req, res, next) => {
  try {
    const { pickupDate, dropoffDate, rentalCarProvider, date } = req.body;

    // Check if the rental car provider exists
    const provider = await RentalCarProvider.findById(rentalCarProvider);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Rental Car Provider not found' });
    }

    // Count the user's existing bookings
    const existingBookings = await Booking.countDocuments({ user: req.user.id });

    if (existingBookings >= 3) {
      return res.status(400).json({ success: false, message: 'Users can only book up to 3 cars' });
    }

    // Create the booking
    const booking = await Booking.create({
      user: req.user.id,
      pickupDate,
      dropoffDate,
      rentalCarProvider,
      date
    });

    res.status(201).json({ success: true, data: booking });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Booking failed', error: err.message });
  }
};

// @desc    Get all bookings (Admin can view all bookings, users can only see their own)
// @route   GET /RentalC01/booking
// @access  Private (Admin/User)
exports.getBookings = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      query = Booking.find().populate('rentalCarProvider').populate('user');
    } else {
      query = Booking.find({ user: req.user.id }).populate('rentalCarProvider');
    }

    const bookings = await query;

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Cannot fetch bookings', error: err.message });
  }
};

// @desc    Get a single booking
// @route   GET /RentalC01/booking/:id
// @access  Private (Admin/User)
exports.getBooking = async (req, res, next) => {
  try {
    // Find the booking by ID
    const booking = await Booking.findById(req.params.id).populate('rentalCarProvider');

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if the user is authorized to view the booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this booking' });
    }

    // Send the booking details in the response
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error('Error fetching booking:', err.message);
    res.status(500).json({ success: false, message: 'Cannot fetch booking', error: err.message });
  }
};

// @desc    Update a booking
// @route   PUT /RentalC01/booking/:id
// @access  Private (Admin/User)
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: booking });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Cannot update booking', error: err.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /RentalC01/bookings/:id
// @access  Private (Admin/User)
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if the user is authorized to delete the booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
    }

    // Use deleteOne() or findByIdAndDelete() to delete the booking
    await Booking.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    console.error('Error deleting booking:', err.message);
    res.status(500).json({ success: false, message: 'Cannot delete booking', error: err.message });
  }
};

