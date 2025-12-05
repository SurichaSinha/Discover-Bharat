const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ msg: 'registered' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Set session
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role,
    };

    res.json({ 
      msg: 'logged in',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoServerError' || error.message.includes('MongoServerError')) {
      return res.status(503).json({ msg: 'Database connection error. Please check if MongoDB is running.' });
    }
    
    res.status(500).json({ msg: 'Server error: ' + error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const user = await User.findById(req.session.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bookmarks: user.bookmarks
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: 'Could not log out' });
    }
    res.json({ msg: 'logged out' });
  });
});

// @desc    Bookmark a state
// @route   POST /api/auth/bookmark/:stateId
// @access  Private
router.post('/bookmark/:stateId', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const userId = req.session.user.id;
    const stateId = req.params.stateId;

    // Find user and check if state is already bookmarked
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if state is already bookmarked
    const isBookmarked = user.bookmarks.includes(stateId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== stateId);
      await user.save();
      res.json({ msg: 'Bookmark removed', bookmarked: false });
    } else {
      // Add bookmark
      user.bookmarks.push(stateId);
      await user.save();
      res.json({ msg: 'Bookmark added', bookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
