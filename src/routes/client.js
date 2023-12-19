const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const { validateSession, clearSession } = require('../utils/session');

router.get('/home', (req, res) => {
    const token = req.query.token;

  if (token) {
    const encodedPublicKey = process.env.PUBLIC_KEY;
    const decodedPublicKey = encodedPublicKey.replace(/\\n/g, '\n');
    const encodedPrivateOwnKey = process.env.PRIVATE_OWN_KEY;
    const decodedPrivateOwnKey = encodedPrivateOwnKey.replace(/\\n/g, '\n');
    try {
      const decoded = jwt.verify(token, decodedPublicKey, { algorithms: ['ES256'] });
      const decodedString = JSON.stringify(decoded);
      console.log(decodedString);
      const jsonPart = decodedString.substring(decodedString.indexOf('{'), decodedString.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonPart);
      const storedValuesStr = data.stored_values.replace(/\\"/g, '"');

      const storedValues = JSON.parse(storedValuesStr);

      // Find the email value
      const arrayEmails = process.env.AUTHORIZAD_EMAILS.split(',');
      for (const item of storedValues) {
          if (item.pointer === "/credentialSubject/email") {
            console.log("Item");
            console.log(item.value.trim());
            if (arrayEmails.includes(item.value.trim())){
              //Create and save new token
              const newToken = jwt.sign({ user: decoded.user }, decodedPrivateOwnKey, { algorithm: 'ES256', expiresIn: '1h' });
              req.session.jwt = newToken;
              return res.redirect('/client/private_area');
            }
          }
      }

      res.render('not_found', { sessionExists: !!req.session.jwt });
    } catch (error) {
      console.log(error);
      res.render('not_found', { sessionExists: !!req.session.jwt });
    }
  } else {
    res.render('home', { sessionExists: !!req.session.jwt });
  }
});

router.get('/private_area', validateSession, (req, res) => {
  res.render('private_area', { sessionExists: !!req.session.jwt });
});

router.get('/logout', clearSession, (req, res) => {
  res.redirect('/client/home');
});

router.get('/not_found', (req, res) => {
  res.redirect('/client/not_found');
});

module.exports = router;
