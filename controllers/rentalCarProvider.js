const RentalCarProvider = require('../models/RentalCarProvider.js');
const Booking = require('../models/Booking.js');


///link : http://localhost:5000/RentalC01/rentalCarProvider
exports.getRentalCarProviders = async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach(param => delete reqQuery[param]);
  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = RentalCarProvider.find(JSON.parse(queryStr)).populate('booking');

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = (page * limit);


  try {
    const total = await RentalCarProvider.countDocuments();
    query = query.skip(startIndex).limit(limit);

    const rentalCarProviders = await query;
    // console.log(req.query);

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    res.status(200).json({
      success: true,
      count: rentalCarProviders.length,
      data: rentalCarProviders
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }

};

exports.getRentalCarProvider = async (req, res, next) => {
  try {
    const rentalCarProvider = await RentalCarProvider.findById(req.params.id);

    if (!rentalCarProvider) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: rentalCarProvider });
  } catch (err) {
    res.status(400).json({ success: false });
  }

};

exports.createRentalCarProvider = async (req, res, next) => {
  try {
    const rentalCarProvider = await RentalCarProvider.create(req.body);
    res.status(201).json({ success: true, data: rentalCarProvider });
  } catch (err) {
    console.error(err); //แสดง error ใน console
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateRentalCarProvider = async (req, res, next) => {
  try {
    const rentalCarProvider = await RentalCarProvider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!rentalCarProvider) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: rentalCarProvider });
  }
  catch (err) {
    res.status(400).json({ success: false });
  }

};

exports.deleteRentalCarProvider = async (req, res, next) => {
  try {
    const rentalCarProvider = await RentalCarProvider.findById(req.params.id);

    if (!rentalCarProvider) {
      return res.status(400).json({ success: false, massage: `Rental Car Provider not found wth id of ${req.params.id}` });
    }

    await Booking.deleteMany({ hospital: req.params.id });
    await RentalCarProvider.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, data: {} });
  }
  catch (err) {
    res.status(400).json({ success: false });
  }

};