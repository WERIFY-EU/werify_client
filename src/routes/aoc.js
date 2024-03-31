const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { AocUser } = require('../models/dataModel');

router.get('/welcome', (req, res) => {
    res.render('/aoc/aoc');
  });

  router.get('/registry', (req, res) => {
    res.render('aoc_registry');
  });

  router.get('/sign_up', (req, res) => {
    const token = req.query.token;
    const aocCredential = {
      firstName: '', 
      familyName: '',
      addressLocality: '',
      addressRegion:'',
      governmentName:'',
    };
    const mapping = {
      "/credentialSubject/FirstName": "firstName",
      "/credentialSubject/FamilyName": "familyName",
      "/credentialSubject/AddressLocality": "addressLocality",
      "/credentialSubject/AddressRegion": "addressRegion",
      "/credentialSubject/GovernmentName": "governmentName",
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
  
        for (const item of storedValues) {
          const key = mapping[item.pointer];
          if (key) {
            aocCredential[key] = item.value.trim();
          }
        }
  
        const aocUser = new AocUser({ aoc_user: aocCredential });
        aocUser.save()
        .then(() => {
          // Handle successful save
          res.render('aoc', { 
            sessionExists: !!req.session.jwt, 
            credential: aocCredential 
          });
        })
        .catch(error => {
          // Handle error
          console.error(error);
          res.render('not_found', { sessionExists: !!req.session.jwt });
        });
  
      } catch (error) {
        console.log(error);
        res.render('not_found', { sessionExists: !!req.session.jwt });
      }
    } else {
      res.render('home', { sessionExists: !!req.session.jwt });
    }
  });

  router.get('/welcomeaoc', (req, res) => {
    res.render('aoc');
  });

  module.exports = router;