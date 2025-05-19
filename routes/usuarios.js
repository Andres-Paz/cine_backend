const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const {
    createUser,
    getCurrentUserWithProfile,
    getAllUsers
} = require('../usuarios/usuarioService');

// Crear usuario
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Obtener usuario actual
router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getCurrentUserWithProfile(userId);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);  // <---- aquí
        res.status(400).json({ message: 'Error al obtener el usuario', details: error.message });
    }
});


// Obtener todos los usuarios (solo admins)
router.get('/', authenticateJWT, async (req, res) => {
    try {
        // ✅ El JWT ya fue decodificado por authenticateJWT y está en req.user
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
        }

        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios.', error });
    }
});


module.exports = router;
