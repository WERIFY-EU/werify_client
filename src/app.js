const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.text());

console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use('/api', apiRoutes);

module.exports = app;
