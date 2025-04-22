const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(403).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    
    jwt.verify(token, 'secreto', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token no válido.' });
        req.user = user;
        next();
    });
};

router.get('/', authenticateJWT, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});

module.exports = router;



/*const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});

module.exports = router;
*/