const express = require('express');
const State = require('../models/State');
const adminCheck = require('../middleware/adminCheck');
const router = express.Router();

// @desc    Get all states
// @route   GET /api/states
// @access  Public
router.get('/', async (req, res) => {
  try {
    const states = await State.find({});
    res.json(states);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Get single state
// @route   GET /api/states/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }
    res.json(state);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

//GET /api/states/byName/:stateName
router.get("/byName/:stateName", async (req, res) => {
  try {
    const { stateName } = req.params;
    // Case-insensitive search
    const state = await State.findOne({
      name: { $regex: new RegExp("^" + stateName + "$", "i") }
    });
    if (!state) {
      return res.status(404).json({ msg: "State not found" });
    }
    res.json(state);
  } catch (error) {
    console.error("Error fetching state by name:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// @desc    Create state
// @route   POST /api/states
// @access  Admin
router.post('/', adminCheck, async (req, res) => {
  try {
    const state = await State.create(req.body);
    res.status(201).json(state);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Update state
// @route   PUT /api/states/:id
// @access  Admin
router.put('/:id', adminCheck, async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }
    res.json(state);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Delete state
// @route   DELETE /api/states/:id
// @access  Admin
router.delete('/:id', adminCheck, async (req, res) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }
    res.json({ msg: 'State deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
