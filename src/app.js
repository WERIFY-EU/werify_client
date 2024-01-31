const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const clientRoutes = require('./routes/client');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.text());
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: process.env.PRIVATE_OWN_KEY,
    resave: false,
    saveUninitialized: true
  }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use('/client', clientRoutes);
app.get('/config', (req, res) => {
  res.json({
      loginUrl: process.env.BASE_URL + '#' + process.env.LOGIN_URL,
      registryUrl: process.env.BASE_URL + '#' + process.env.REGISTRY_URL
  });
});
app.use('*', (req, res) => {
  res.redirect('/client/home#');
});

module.exports = app;
