const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/welcome', (req, res) => {
    res.render('murcia');
  });

  module.exports = router;