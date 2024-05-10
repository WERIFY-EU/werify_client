const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/certificate', (req, res) => {
  const token = req.query.token;
  const certificateDetails = {
    email: '', 
    phone: '',
    name: '', 
    lastName: ''
  };
  if (token) {
    const encodedPublicKey = process.env.PUBLIC_KEY;
    const decodedPublicKey = encodedPublicKey.replace(/\\n/g, '\n');
    try {
      const decoded = jwt.verify(token, decodedPublicKey, { algorithms: ['ES256'], ignoreNotBefore: true });
      const decodedString = JSON.stringify(decoded);
      const jsonPart = decodedString.substring(decodedString.indexOf('{'), decodedString.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonPart);
      const storedValuesStr = data.stored_values.replace(/\\"/g, '"');

      const storedValues = JSON.parse(storedValuesStr);

      // Find the email value
      for (const item of storedValues) {
          if (item.pointer === "/credentialSubject/email") {
            certificateDetails.email = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/phone") {
            certificateDetails.phone = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/name") {
            certificateDetails.name = item.value.trim().toUpperCase();
          }
          if (item.pointer === "/credentialSubject/lastName") {
            certificateDetails.lastName = item.value.trim().toUpperCase();
          }
      }

      res.render('certificate', { 
          lng: req.language,
          certificate: certificateDetails 
        });

    } catch (error) {
      console.log(error);
      res.render('not_found', { lng: req.language, sessionExists: !!req.session.jwt });
    }
  } else {
    res.render('home', { lng: req.language, sessionExists: !!req.session.jwt });
  }
  });


  module.exports = router;