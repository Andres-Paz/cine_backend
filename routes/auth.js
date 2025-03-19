const express = require('express');
const { loginUser } = require('../auth/authService');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const response = await loginUser(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(401).json(error);
    }
});

module.exports = router;