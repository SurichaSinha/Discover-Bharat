const express = require('express');
const Article = require('../models/Article');
const authSession = require('../middleware/authSession');
const adminCheck = require('../middleware/adminCheck');
const router = express.Router();

// @desc    Get articles (published by default, pending for admins)
// @route   GET /api/articles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : { status: 'published' };
    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Get single published article
// @route   GET /api/articles/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id, status: 'published' });
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Create article (pending status)
// @route   POST /api/articles
// @access  Private
router.post('/', authSession, async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      status: 'pending',
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Admin
router.put('/:id', adminCheck, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// @desc    Approve article (set to published)
// @route   PUT /api/articles/approve/:id
// @access  Admin
router.put('/approve/:id', adminCheck, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json({ msg: 'Article published', article });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Admin
router.delete('/:id', adminCheck, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json({ msg: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
