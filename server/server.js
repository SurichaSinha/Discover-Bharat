require('dotenv').config();
const express = require('express');
// const cors = require('cors'); // Removed CORS package
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const stateRoutes = require('./routes/stateRoutes');
const productRoutes = require('./routes/productRoutes');
const innovationRoutes = require('./routes/innovationRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

// ================= CORS HEADERS ================= //
app.use((req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// ====================================================== //

app.use(express.json());
app.use(cookieParser());

// ================= SESSION CONFIGURATION ============= //
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// ====================================================== //

// Connect to MongoDB
connectDB();

// ================= ROUTES ============================= //
app.use('/api/auth', authRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/products', productRoutes);
app.use('/api/innovations', innovationRoutes);
app.use('/api/articles', articleRoutes);

// Test endpoint
app.get('/api', (req, res) => {
  res.json({ msg: 'API running' });
});

// ====================================================== //

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for http://localhost:3000`);
});

