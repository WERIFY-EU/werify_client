const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');

router.get('/certificate', async (req, res) => {
  const token = req.query.token;
  const certificateDetails = {
    email: '', 
    phone: '',
    name: '', 
    lastName: ''
  };
  var url = "https://issuer-staging.werify.eu/credential-details/?credentialId=";
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
          if (item.pointer === "/id") {
            url = url + item.value.trim();
          }
      }

      const browser = await puppeteer.launch({
        executablePath: '/opt/google/chrome/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();

      
      const qrImage = await QRCode.toDataURL(url);

       // Render the EJS template with your data
       res.render('certificate', { 
        lng: req.language,
        certificate: certificateDetails,
        qrImage:qrImage
    }, async (err, html) => {
        if (err) {
            console.error(err);
            res.send("Error rendering the page");
        }

        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        const pdf = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        await browser.close();

        res.contentType('application/pdf');
        res.send(pdf);
    });

      // res.render('certificate', { 
      //     lng: req.language,
      //     certificate: certificateDetails 
      //   });

    } catch (error) {
      console.log(error);
      res.render('not_found', { lng: req.language, sessionExists: !!req.session.jwt });
    }
  } else {
    res.render('home', { lng: req.language, sessionExists: !!req.session.jwt });
  }
  });


  module.exports = router;