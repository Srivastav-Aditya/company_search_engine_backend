const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const auth = require('../middleware/auth');

// Get Companies with Search, Sort, Filter, and Pagination
router.get('/', auth, async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortField = 'id',
    sortOrder = 'asc',
    search = '',
    ...filters
  } = req.query;

  const query = {};

  // Global Search
  if (search) {
    query.$or = [
      { entity: { $regex: search, $options: 'i' } },
      { sector: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
      { website: { $regex: search, $options: 'i' } },
    ];
  }

  // Filters
  Object.keys(filters).forEach((key) => {
    if (Company.schema.paths[key]) {
      query[key] = filters[key];
    }
  });

  try {
    const companies = await Company.find(query)
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Company.countDocuments(query);

    res.json({
      companies,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalRecords: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
