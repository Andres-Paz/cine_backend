const express = require('express');
const router = express.Router();
const {
    getPeliculas,
    getPeliculaById,
    createPelicula,
    updatePelicula,
    deletePelicula
} = require('../peliculas/peliculaService');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, async (req, res) => {
    try {
        const peliculas = await getPeliculas();
        res.json(peliculas);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const pelicula = await getPeliculaById(req.params.id);
        res.json(pelicula);
    } catch (err) {
        res.status(404).json(err);
    }
});

router.post('/', authenticateJWT, async (req, res) => {
    try {
        const pelicula = await createPelicula(req.body);
        res.status(201).json(pelicula);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const response = await updatePelicula(req.params.id, req.body);
        res.json(response);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const response = await deletePelicula(req.params.id);
        res.json(response);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
