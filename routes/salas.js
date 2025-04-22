const express = require('express');
const router = express.Router();
const {
    getSalas, getSalaById, createSala, updateSala, deleteSala
} = require('../salas/salaService');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, async (req, res) => {
    try {
        const salas = await getSalas();
        res.json(salas);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const sala = await getSalaById(req.params.id);
        res.json(sala);
    } catch (err) {
        res.status(404).json(err);
    }
});

router.post('/', authenticateJWT, async (req, res) => {
    try {
        const sala = await createSala(req.body);
        res.status(201).json(sala);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const response = await updateSala(req.params.id, req.body);
        res.json(response);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const response = await deleteSala(req.params.id);
        res.json(response);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
