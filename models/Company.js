const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  id: Number,
  entity: String,
  sector: String,
  email: String,
  incorporation: Date,
  address: String,
  revenue: Number,
  website: String,
  is_verified: Boolean,
});

module.exports = mongoose.model('Company', CompanySchema);
