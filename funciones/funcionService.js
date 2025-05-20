const db = require('../config/db');


const createFuncion = ({ fecha, hora_inicio, hora_final, sala_id, pelicula_id }) => {
    return new Promise((resolve, reject) => {
        if (!fecha || !hora_inicio || !hora_final || !sala_id || !pelicula_id) {
            return reject({ message: 'Todos los campos son requeridos' });
        }

        const query = 'INSERT INTO funciones (fecha, hora_inicio, hora_final, sala_id, pelicula_id) VALUES (?, ?, ?, ?, ?)';
        
        // No convertimos la fecha a Date, se usa el string tal cual (YYYY-MM-DD)
        db.query(query, [fecha, hora_inicio, hora_final, sala_id, pelicula_id], (err, result) => {
            if (err) return reject(err);
            resolve({ 
                id: result.insertId, 
                fecha, 
                hora_inicio, 
                hora_final, 
                sala_id, 
                pelicula_id 
            });
        });
    });
};


const getFunciones = (pelicula_id) => {
    return new Promise((resolve, reject) => {
        const now = new Date();

        // Fecha local en formato YYYY-MM-DD
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        
        // Hora local en formato HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}:${seconds}`;
        

        let query = `
            SELECT 
                funciones.*, 
                sala.nombre AS sala_nombre, 
                sala.tipo AS sala_tipo,
                sala.cupo - IFNULL(ticket_counts.total_tickets, 0) AS cupo_disponible
            FROM funciones
            INNER JOIN sala ON funciones.sala_id = sala.id
            LEFT JOIN (
                SELECT funciones_id, COUNT(*) AS total_tickets
                FROM ticket
                GROUP BY funciones_id
            ) AS ticket_counts ON funciones.id = ticket_counts.funciones_id
            WHERE (fecha > ? OR (fecha = ? AND hora_inicio >= ?))
        `;
        
        const params = [today, today, currentTime];

        if (pelicula_id) {
            query += ' AND funciones.pelicula_id = ?';
            params.push(pelicula_id);
        }

        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};




// Obtener función por ID
const getFuncionById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                funciones.*, 
                sala.nombre AS sala_nombre, 
                sala.tipo AS sala_tipo,
                sala.cupo - IFNULL(ticket_counts.total_tickets, 0) AS cupo_disponible
            FROM funciones
            INNER JOIN sala ON funciones.sala_id = sala.id
            LEFT JOIN (
                SELECT funciones_id, COUNT(*) AS total_tickets
                FROM ticket
                GROUP BY funciones_id
            ) AS ticket_counts ON funciones.id = ticket_counts.funciones_id
            WHERE funciones.id = ?
        `;
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject({ message: 'Función no encontrada' });
            resolve(results[0]);
        });
    });
};


// Actualizar función
const updateFuncion = (id, { fecha, hora_inicio, hora_final, sala_id }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existing = await getFuncionById(id);

            const nuevaFecha = fecha || existing.fecha;
            const nuevaHoraInicio = hora_inicio || existing.hora_inicio;
            const nuevaHoraFinal = hora_final || existing.hora_final;
            const nuevoSalaId = sala_id || existing.sala_id;
            const nuevoPeliculaId = pelicula_id || existing.pelicula_id;

            const query = 'UPDATE funciones SET fecha = ?, hora_inicio = ?, hora_final = ?, sala_id = ? WHERE id = ?';
            db.query(query, [nuevaFecha, nuevaHoraInicio, nuevaHoraFinal, nuevoSalaId, nuevoPeliculaId, id], (err) => {
                if (err) return reject(err);
                resolve({ message: 'Función actualizada correctamente' });
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Eliminar función
const deleteFuncion = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM funciones WHERE id = ?';
        db.query(query, [id], (err) => {
            if (err) return reject(err);
            resolve({ message: 'Función eliminada correctamente' });
        });
    });
};

module.exports = {
    createFuncion,
    getFunciones,
    getFuncionById,
    updateFuncion,
    deleteFuncion
};
