const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');
const { auth, isEditor } = require('../middleware/auth');

const router = express.Router();

// Get all published news
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = { published: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }

    const news = await News.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single news article
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'name email');

    if (!news || !news.published) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get editor's news
router.get('/editor/my-news', auth, isEditor, async (req, res) => {
  try {
    const news = await News.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create news (Editor only)
router.post('/', auth, isEditor, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('summary').notEmpty().withMessage('Summary is required'),
  body('category').isIn(['Politics', 'Sports', 'Technology', 'Health', 'Entertainment', 'Business', 'World'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, summary, category, imageUrl, published = false } = req.body;

    const news = new News({
      title,
      content,
      summary,
      category,
      imageUrl,
      published,
      author: req.user._id
    });

    await news.save();
    await news.populate('author', 'name');

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update news (Editor only)
router.put('/:id', auth, isEditor, async (req, res) => {
  try {
    const news = await News.findOne({ _id: req.params.id, author: req.user._id });
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    Object.assign(news, req.body);
    await news.save();
    await news.populate('author', 'name');

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete news (Editor only)
router.delete('/:id', auth, isEditor, async (req, res) => {
  try {
    const news = await News.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
