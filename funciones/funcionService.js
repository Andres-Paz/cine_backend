const db = require('../config/db');


const createFuncion = ({ fecha, hora_inicio, hora_final, sala_id, pelicula_id}) => {
    return new Promise((resolve, reject) => {
        if (!fecha || !hora_inicio || !hora_final || !sala_id || !pelicula_id) {
            return reject({ message: 'Todos los campos son requeridos' });
        }

        const query = 'INSERT INTO funciones (fecha, hora_inicio, hora_final, sala_id, pelicula_id) VALUES (?, ?, ?, ?, ?)';
        const fechaValidada = new Date(fecha);
        db.query(query, [fechaValidada, hora_inicio, hora_final, sala_id, pelicula_id], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, fechaValidada, hora_inicio, hora_final, sala_id, pelicula_id});
        });
    });
};

const getFunciones = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM funciones';
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Obtener función por ID
const getFuncionById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM funciones WHERE id = ?';
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
