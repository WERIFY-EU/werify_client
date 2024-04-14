const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/dataModel');
const { validateSession, clearSession } = require('../utils/session');


router.get('/home', (req, res) => {
  const token = req.query.token;

  if (token) {
    const encodedPublicKey = process.env.PUBLIC_KEY;
    const decodedPublicKey = encodedPublicKey.replace(/\\n/g, '\n');
    const encodedPrivateOwnKey = process.env.PRIVATE_OWN_KEY;
    const decodedPrivateOwnKey = encodedPrivateOwnKey.replace(/\\n/g, '\n');
    try {
      const decoded = jwt.verify(token, decodedPublicKey, { algorithms: ['ES256'], ignoreNotBefore: true });
      const decodedString = JSON.stringify(decoded);
      const jsonPart = decodedString.substring(decodedString.indexOf('{'), decodedString.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonPart);
      const storedValuesStr = data.stored_values.replace(/\\"/g, '"');

      const storedValues = JSON.parse(storedValuesStr);

      // Find the email value
      for (const item of storedValues) {
          if (item.pointer === "/credentialSubject/email"  || item.pointer === "/credentialSubject/correo-e") {

            return checkUserExists(item.value.trim())
              .then(exists => {
                if (exists) {
                  const newToken = jwt.sign({ user: decoded.user }, decodedPrivateOwnKey, { algorithm: 'ES256', expiresIn: '1h' });
                  req.session.jwt = newToken;
                  return res.redirect('/client/private_area');
                } else {
                  res.render('not_found', { sessionExists: !!req.session.jwt });
                }
              })
              .catch(error => {
                console.error('An error occurred:', error);
                return res.render('error', { error: error });
              });
          }
      }

      res.render('not_found', { lng: req.language,sessionExists: !!req.session.jwt });
    } catch (error) {
      console.log(error);
      res.render('not_found', { lng: req.language,sessionExists: !!req.session.jwt });
    }
  } else {
    res.render('home', { lng: req.language, sessionExists: !!req.session.jwt });
  }
});

router.get('/private_area', validateSession, (req, res) => {
  res.render('private_area', { lng: req.language, sessionExists: !!req.session.jwt });
});

router.get('/registry', (req, res) => {
  const token = req.query.token;
  const userDetails = {
    email: '', 
    firstName: '', 
    familyName: '',
    dateOfBirth: '',
    DNI:'',
    NIF_del_organismo:'',
    Organismo:'',
    Puesto:'',
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
          if (item.pointer === "/credentialSubject/email" || item.pointer === "/credentialSubject/correo-e") {
            userDetails.email = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/firstName"  || item.pointer === "/credentialSubject/Nombre") {
            userDetails.firstName = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/familyName"  || item.pointer === "/credentialSubject/Apellido1") {
            userDetails.familyName = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/dateOfBirth") {
            userDetails.dateOfBirth = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/DNI") {
            userDetails.DNI = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/NIF del organismo") {
            userDetails.NIF_del_organismo = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/Organismo") {
            userDetails.Organismo = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/Puesto") {
            userDetails.Puesto = item.value.trim();
          }
      }

      const newUser = new User({ user: userDetails });
      newUser.save()
      .then(() => {
        // Handle successful save
        res.render('successful_registry', { 
          lng: req.language,
          sessionExists: !!req.session.jwt, 
          user: userDetails 
        });
      })
      .catch(error => {
        // Handle error
        console.error(error);
        res.render('not_found', { lng: req.language, sessionExists: !!req.session.jwt });
      });

    } catch (error) {
      console.log(error);
      res.render('not_found', { lng: req.language, sessionExists: !!req.session.jwt });
    }
  } else {
    res.render('home', { lng: req.language, sessionExists: !!req.session.jwt });
  }
});

router.get('/logout', clearSession, (req, res) => {
  res.redirect('/client/home');
});

router.get('/not_found', (req, res) => {
  res.redirect('/client/not_found');
});


router.get('/successful_registry', (req, res) => {
  res.redirect('/client/successful_registry');
});

function checkUserExists(email) {
  return User.findOne({ 'user.email': email }).then(user => {
    return !!user; // Convert the result to a boolean
  }).catch(error => {
    console.error('Error checking user existence:', error);
    throw error; // Re-throw the error to handle it in the calling function
  });
}

module.exports = router;
