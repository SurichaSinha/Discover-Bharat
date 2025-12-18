const express = require('express');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const router = express.Router();

// @desc    Get vendors by product ID
// @route   GET /api/products/:productId/vendors
// @access  Public
router.get('/products/:productId', async (req, res) => {
  try {
    const vendors = await Vendor.find({ productId: req.params.productId });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Create vendor for a product
// @route   POST /api/products/:productId/vendors
// @access  Public
router.post('/products/:productId', async (req, res) => {
  try {
    // Check if product exists
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const vendor = await Vendor.create({
      ...req.body,
      productId: req.params.productId,
    });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

module.exports = router;
