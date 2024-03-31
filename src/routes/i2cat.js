const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { I2CATUser } = require('../models/dataModel');
const { sign } = require('crypto');

router.get('/welcome', (req, res) => {
    res.render('i2cat');
  });

  router.get('/registry', (req, res) => {
    res.render('i2cat_registry');
  });

  router.get('/sign_up', (req, res) => {
    const token = req.query.token;
    const i2catCredential = {
      firstName: '', 
      familyName: '',
      addressLocality: '',
      personalIdentifier:'',
      collegeMembershipID:'',
      organizationName:'',
      foreignLanguage:'',
      governmentIdentifier:'',
    };
    const mapping = {
      "/credentialSubject/FirstName": "firstName",
      "/credentialSubject/FamilyName": "familyName",
      "/credentialSubject/AddressLocality": "addressLocality",
      "/credentialSubject/PersonalIdentifier": "personalIdentifier",
      "/credentialSubject/CollegeMembershipID": "collegeMembershipID",
      "/credentialSubject/OrganizationName": "organizationName",
      "/credentialSubject/ForeignLanguage": "foreignLanguage",
      "/credentialSubject/GovernmentIdentifier": "governmentIdentifier",
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
            i2catCredential[key] = item.value.trim();
          }
        }
  
        const newI2catUser = new I2CATUser({ i2cat_user: i2catCredential });
        newI2catUser.save()
        .then(() => {
          // Handle successful save
          res.render('i2cat', { 
            sessionExists: !!req.session.jwt, 
            credential: newI2catUser 
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

  module.exports = router;