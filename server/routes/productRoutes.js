const express = require('express');
const Product = require('../models/Product');
const adminCheck = require('../middleware/adminCheck');
const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Admin
router.post('/', adminCheck, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
router.put('/:id', adminCheck, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
router.delete('/:id', adminCheck, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
