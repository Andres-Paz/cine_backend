const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});

module.exports = router;
