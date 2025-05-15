const express = require('express');
const { loginUser } = require('../auth/authService');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const response = await loginUser(req.body);
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${response.token}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

module.exports = router;