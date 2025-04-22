const express = require('express');
const router = express.Router();
const ticketService = require('../reservas/reservaService');

// Crear ticket
router.post('/', async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener ticket por ID
router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar ticket
router.put('/:id', async (req, res) => {
    try {
        const updated = await ticketService.updateTicket(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar ticket
router.delete('/:id', async (req, res) => {
    try {
        const result = await ticketService.deleteTicket(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
