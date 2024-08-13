const mongoose = require('mongoose');
const csv = require('csvtojson');
const Company = require('./models/Company');
const dotenv = require('dotenv');

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const companies = await csv().fromFile('company_data.csv');
    await Company.insertMany(companies);
    console.log('Data Imported');
    process.exit();
  })
  .catch((err) => console.log(err));
