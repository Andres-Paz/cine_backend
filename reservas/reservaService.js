const db = require('../config/db');
const funcionService = require('../funciones/funcionService');

// Crear ticket
const createTicket = async ({ fecha, precio, butaca, perfil_id, funciones_id }) => {
    if (!fecha || !precio || !butaca || !perfil_id || !funciones_id) {
        throw { message: 'Todos los campos son requeridos' };
    }

    const fechaValidada = new Date(fecha);

    const funcion = await funcionService.getFuncionById(funciones_id);

    if (!funcion || !funcion.sala_id) {
        throw { message: 'La función no existe o no tiene una sala asociada' };
    }

    return new Promise((resolve, reject) => {
        const insertTicket = 'INSERT INTO ticket (fecha, precio, butaca, perfil_id, funciones_id) VALUES (?, ?, ?, ?, ?)';
        const updateButaca = 'UPDATE butaca SET disponibilidad = false WHERE nomenclatura = ? AND sala_id = ?';

        db.query(insertTicket, [fechaValidada, precio, butaca, perfil_id, funciones_id], (err, result) => {
            if (err) return reject(err);

            db.query(updateButaca, [butaca, funcion.sala_id], (err2) => {
                if (err2) return reject(err2);

                resolve({
                    id: result.insertId,
                    fecha: fechaValidada,
                    precio,
                    butaca,
                    perfil_id,
                    funciones_id
                });
            });
        });
    });
};

// ✅ Obtener todos los tickets con filtros opcionales por funcion_id y perfil_id
const getAllTickets = (funcion_id, perfil_id) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ticket';
        const conditions = [];
        const params = [];

        if (funcion_id) {
            conditions.push('funciones_id = ?');
            params.push(funcion_id);
        }

        if (perfil_id) {
            conditions.push('perfil_id = ?');
            params.push(perfil_id);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Obtener ticket por ID
const getTicketById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM ticket WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// Actualizar ticket
const updateTicket = (id, { fecha, precio, butaca, perfil_id, funciones_id }) => {
    return new Promise((resolve, reject) => {
        getTicketById(id).then(ticketExistente => {
            if (!ticketExistente) return reject({ message: 'Ticket no encontrado' });

            const nuevoTicket = {
                fecha: fecha || ticketExistente.fecha,
                precio: precio || ticketExistente.precio,
                butaca: butaca || ticketExistente.butaca,
                perfil_id: perfil_id || ticketExistente.perfil_id,
                funciones_id: funciones_id || ticketExistente.funciones_id
            };

            const query = 'UPDATE ticket SET fecha = ?, precio = ?, butaca = ?, perfil_id = ?, funciones_id = ? WHERE id = ?';
            db.query(query, [nuevoTicket.fecha, nuevoTicket.precio, nuevoTicket.butaca, nuevoTicket.perfil_id, nuevoTicket.funciones_id, id], (err) => {
                if (err) return reject(err);
                resolve({ message: 'Ticket actualizado correctamente' });
            });
        }).catch(reject);
    });
};

// Eliminar ticket
const deleteTicket = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM ticket WHERE id = ?', [id], (err) => {
            if (err) return reject(err);
            resolve({ message: 'Ticket eliminado correctamente' });
        });
    });
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicket,
    deleteTicket
};
