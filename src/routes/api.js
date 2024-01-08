const express = require('express');
const router = express.Router();
const { Data } = require('../models/dataModel');
const jwt = require('jsonwebtoken');

router.post('/data', async (req, res) => {
    let token = req.body;
    const encodedPublicKey = process.env.PUBLIC_KEY;
    // Decoding the line breaks
    const decodedPublicKey = encodedPublicKey.replace(/\\n/g, '\n');
    try {
        const decoded = jwt.verify(token, decodedPublicKey, { algorithms: ['ES256'], ignoreNotBefore: true });
        const newData = new Data({ data: decoded });
        await newData.save();
        res.status(201).send(newData);
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message);
    }
});

module.exports = router;
