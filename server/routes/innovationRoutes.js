const express = require('express');
const Innovation = require('../models/Innovation');
const authSession = require('../middleware/authSession');
const adminCheck = require('../middleware/adminCheck');
const router = express.Router();

// @desc    Get all innovations
// @route   GET /api/innovations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const innovations = await Innovation.find({}).populate('submittedBy', 'name');
    res.json(innovations);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Get innovations by state
// @route   GET /api/innovations/state/:stateName
// @access  Public
router.get('/state/:stateName', async (req, res) => {
  try {
    const { stateName } = req.params;
    const innovations = await Innovation.find({
      state: { $regex: new RegExp("^" + stateName + "$", "i") }
    }).populate('submittedBy', 'name');
    res.json(innovations);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Get single innovation
// @route   GET /api/innovations/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const innovation = await Innovation.findById(req.params.id).populate('submittedBy', 'name');
    if (!innovation) {
      return res.status(404).json({ msg: 'Innovation not found' });
    }
    res.json(innovation);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Create innovation
// @route   POST /api/innovations
// @access  Private
router.post('/', authSession, async (req, res) => {
  try {
    const innovation = await Innovation.create({
      ...req.body,
      submittedBy: req.user.id,
    });
    res.status(201).json(innovation);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Update innovation
// @route   PUT /api/innovations/:id
// @access  Admin
router.put('/:id', adminCheck, async (req, res) => {
  try {
    const innovation = await Innovation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!innovation) {
      return res.status(404).json({ msg: 'Innovation not found' });
    }
    res.json(innovation);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Vote on innovation
// @route   PUT /api/innovations/vote/:id
// @access  Private
router.put('/vote/:id', authSession, async (req, res) => {
  try {
    const innovation = await Innovation.findById(req.params.id);
    if (!innovation) {
      return res.status(404).json({ msg: 'Innovation not found' });
    }

    // Check if user already voted
    if (innovation.voters.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already voted' });
    }

    // Add voter and increment votes
    innovation.voters.push(req.user.id);
    innovation.votes += 1;
    await innovation.save();

    res.json({ msg: 'Vote recorded', votes: innovation.votes });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Delete innovation
// @route   DELETE /api/innovations/:id
// @access  Admin
router.delete('/:id', adminCheck, async (req, res) => {
  try {
    const innovation = await Innovation.findByIdAndDelete(req.params.id);
    if (!innovation) {
      return res.status(404).json({ msg: 'Innovation not found' });
    }
    res.json({ msg: 'Innovation deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
