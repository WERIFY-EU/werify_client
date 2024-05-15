const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const clientRoutes = require('./routes/client');
const certificateRoutes = require('./routes/certificate');
const ebsiRoutes = require('./routes/ebsi');
const i2catRoutes =  require('./routes/i2cat');
const aocRoutes =  require('./routes/aoc');
const murciaRoutes =  require('./routes/murcia');
const path = require('path');
const mongoose = require('mongoose');
const i18next = require('./i18n');
const middleware = require('i18next-http-middleware');
const { Certificate } = require('crypto');
const app = express();
require('dotenv').config();


app.use(express.text());
app.use(express.static(path.join(__dirname, 'public')))
app.use(middleware.handle(i18next));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: process.env.PRIVATE_OWN_KEY,
    resave: false,
    saveUninitialized: true
  }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });



app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use('/client', clientRoutes);
app.use('/certificate', certificateRoutes);
app.use('/ebsi', ebsiRoutes);
app.use('/i2cat', i2catRoutes);
app.use('/aoc', aocRoutes);
app.use('/murcia',murciaRoutes);
app.get('/config', (req, res) => {
  res.json({
      loginUrl: process.env.BASE_URL + '#' + process.env.LOGIN_URL,
      registryUrl: process.env.BASE_URL + '#' + process.env.REGISTRY_URL,
      certificateUrl: process.env.BASE_URL + '#' + process.env.CERTIFICATE_URL,
      registryUrlAOC: process.env.BASE_URL + '#' + process.env.REGISTRY_URL_AOC,
      registryUrlI2CAT: process.env.BASE_URL + '#' + process.env.REGISTRY_URL_I2CAT,
//      langi: process.env.BASE_URL + '#' + process.env.REGISTRY_URL_I2CAT,
  });
});

app.use((req, res, next) => {
  res.locals.lng = req.language;
  next();
});

app.use('*', (req, res) => {
  res.redirect('/client/home#');
}); 

module.exports = app;
