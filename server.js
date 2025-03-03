const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

//load env
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();


console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // ตั้ง timeout ให้เร็วขึ้น
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));



//=======rentelCar_P booking user routes======
const rentelCarProvider = require('./routes/rentalCarProvider');
const booking = require('./routes/booking');
const auth = require('./routes/auth');

//===app====
const app = express();
app.use(express.json());
app.use('/RentalC01/rentalCarProvider', rentelCarProvider);
app.use('/RentalC01/booking', booking);
app.use('/RentalC01/auth', auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('RantalCar server running in', process.env.NODE_ENV, 'mode on port', PORT));