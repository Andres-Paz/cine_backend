const db = require('../config/db');

const getSalas = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM sala', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getSalaById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM sala WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject({ message: 'Sala no encontrada' });
            resolve(results[0]);
        });
    });
};

const createSala = ({ nombre, cupo, filas, columnas, tipo }) => {
    return new Promise((resolve, reject) => {
        const campos = { nombre, cupo, filas, columnas, tipo };
        const faltantes = [];

        for (const [clave, valor] of Object.entries(campos)) {
            if (valor === undefined || valor === null || valor === '') {
                faltantes.push(clave);
            }
        }

        if (faltantes.length > 0) {
            return reject({
                message: 'Faltan campos requeridos',
                camposFaltantes: faltantes
            });
        }

        const insertSalaQuery = 'INSERT INTO sala (nombre, cupo, filas, columnas, tipo) VALUES (?, ?, ?, ?, ?)';
        db.query(insertSalaQuery, [nombre, cupo, filas, columnas, tipo], (err, result) => {
            if (err) return reject(err);

            const salaId = result.insertId;

            // Crear butacas
            const butacas = [];
            const letraBase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            for (let i = 0; i < filas; i++) {
                const filaLetra = letraBase[i];
                for (let j = 1; j <= columnas; j++) {
                    const butacaId = `${filaLetra}${j}`;
                    butacas.push([butacaId, true, salaId]);
                }
            }

            const insertButacaQuery = 'INSERT INTO butaca (nomenclatura, disponibilidad, sala_id) VALUES ?';

            db.query(insertButacaQuery, [butacas], (err2) => {
                if (err2) return reject(err2);

                resolve({
                    message: 'Sala y butacas creadas correctamente',
                    sala: {
                        id: salaId,
                        nombre,
                        cupo,
                        filas,
                        columnas,
                        tipo
                    },
                    totalButacas: butacas.length
                });
            });
        });
    });
};
const updateSala = async (id, nuevosDatos) => {
    try {
        const salaExistente = await getSalaById(id);
        if (!salaExistente) {
            throw { message: 'Sala no encontrada' };
        }

        const {
            nombre = salaExistente.nombre,
            cupo = salaExistente.cupo, // Modificar cupo
            filas = salaExistente.filas,
            columnas = salaExistente.columnas,
            tipo = salaExistente.tipo
        } = nuevosDatos;

        const query = 'UPDATE sala SET nombre = ?, cupo = ?, filas = ?, columnas = ?, tipo = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [nombre, cupo, filas, columnas, tipo, id], (err) => {
                if (err) return reject(err);
                resolve({ message: 'Sala actualizada correctamente' });
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

const deleteSala = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM sala WHERE id = ?', [id], (err) => {
            if (err) return reject(err);
            resolve({ message: 'Sala eliminada correctamente' });
        });
    });
};

module.exports = {
    getSalas,
    getSalaById,
    createSala,
    updateSala,
    deleteSala
};
