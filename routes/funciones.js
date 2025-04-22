const express = require('express');
const router = express.Router();
const funcionService = require('../funciones/funcionService');

// Crear función
router.post('/', async (req, res) => {
    try {
        const funcion = await funcionService.createFuncion(req.body);
        res.json(funcion);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Obtener todas
router.get('/', async (req, res) => {
    try {
        const funciones = await funcionService.getFunciones();
        res.json(funciones);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
    try {
        const funcion = await funcionService.getFuncionById(req.params.id);
        res.json(funcion);
    } catch (error) {
        res.status(404).json(error);
    }
});

// Actualizar
router.put('/:id', async (req, res) => {
    try {
        const result = await funcionService.updateFuncion(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Eliminar
router.delete('/:id', async (req, res) => {
    try {
        const result = await funcionService.deleteFuncion(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;
