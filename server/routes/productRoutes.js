const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// @desc    Get all products or filter by state
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { state } = req.query;

    let query = {};
    if (state) {
      query.state = { $regex: new RegExp("^" + state + "$", "i") };
    }

    const products = await Product.find(query);
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
// @access  Public
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

module.exports = router;
