const path = require('path');
const jwt = require('jsonwebtoken');

const validateSession = (req, res, next) => {
    if (req.session && req.session.jwt) {
        const encodedPublicOwnKey = process.env.PUBLIC_OWN_KEY;
        const decodedPublicOwnKey = encodedPublicOwnKey.replace(/\\n/g, '\n');
        try {
            // Verify the JWT - replace 'YOUR_PUBLIC_KEY' with your actual public key
            const decoded = jwt.verify(req.session.jwt, decodedPublicOwnKey);
            next(); // Session is valid, proceed to the route handler
        } catch (error) {
            // JWT verification failed, redirect to home
            res.redirect('/client/home');
        }
    } else {
        // No session or JWT, redirect to home
        res.redirect('/client/home');
    }
};

const clearSession = (req, res, next) => {
    if (req.session) {
        delete req.session.jwt; // or req.session.jwt = null;
        next(); // Proceed to the next middleware or route handler
    } else {
        // Handle the case where there is no session
        res.status(400).send('No session to clear');
    }
};

module.exports = {
    validateSession,
    clearSession
};
