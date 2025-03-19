const express = require('express');
const { createUser } = require('../usuarios/usuarioService');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;