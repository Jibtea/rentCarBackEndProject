const mongoose = require('mongoose');

const RentalCarProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  district: {
    type: String,
    required: [true, 'Please add a district']
  },
  province: {
    type: String,
    required: [true, 'Please add a province']
  },
  postalcode: {
    type: String,
    required: [true, 'Please add a postalcode'],
    maxlength: [5, 'Postal Code can not be more than 5 digits']
  },
  tel: {
    type: String,
    unique: true
  },
  region: {
    type: String,
    required: [true, 'Please add a region']
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

RentalCarProviderSchema.virtual('booking', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'rentalCarProvider',
  justOne: false
}
);

module.exports = mongoose.model('RentalCarProvider', RentalCarProviderSchema);