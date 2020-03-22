const express = require('express');
const connectDB = require('./config/db'); // connect to DB
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');

const app = express();

// Body parser to handle bodies of post requests
// I can acces it as req.body
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// File uploading
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Make uploads folder with images publicly available - set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Router
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/auth', authRoutes);

// Handle errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled rejection
process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
