const User = require('../models/User');

// link : http://localhost:5000/RentalC01/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, tel, email, password, role } = req.body;

    const existingUser = await User.findOne({ tel });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "Phone number already registered!" });
    }


    //Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role
    });
    //const token = user.getSignedJwtToken();
    //res.status(200).json({success:true, token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, msg: "Cannot register" });
    console.log(err.stack);
  }
};

// link : http://localhost:5000/RentalC01/auth/login
exports.login = async (req, res, next) => {

  try {
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide an email and password'
      });
    }

    //Check for user
    const user = await
      User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    //Create token
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Cannot convert email or password to string' });
  }
};

//Get token from model, create cookie and send response
//=====================++++++++++++++======================
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token
  })
}
//=============+++++++++++++++++++=========================


// link : http://localhost:5000/RentalC01/auth/me
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
};

// link http://localhost:5000/RentalC01/auth/logout
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.log(err.status);
    return res.status(400).json({
      success: false,
      msg: 'cannot logout'
    });
  }

}

//===========================more func==========================//
exports.update = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Current user ID:", req.user ? req.user.id : "undefined");
    console.log("Target user ID:", user.id);

    if (req.user.role !== "admin" && user.id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this user" });
    }

    // ❌ ห้ามแก้ไข role
    if (req.body.role) {
      delete req.body.role;
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cannot update user", error: err.message });
  }
};