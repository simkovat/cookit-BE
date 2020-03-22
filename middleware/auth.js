const jwt = require('jsonwebtoken');
const asyncHndler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHndler(async (req, res, next) => {
  let token;

  // TODO: should I take the token from header or from the cookie?
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});
