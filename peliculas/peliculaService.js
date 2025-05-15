const db = require('../config/db');

const getPeliculas = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM pelicula', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getPeliculaById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM pelicula WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject({ message: 'Película no encontrada' });
            resolve(results[0]);
        });
    });
};

const createPelicula = ({ nombre, duracion, clasificacion, imagen, fecha_inicio, fecha_fin, is_active }) => {
    return new Promise((resolve, reject) => {
        const campos = { nombre, duracion, clasificacion, imagen, fecha_inicio, fecha_fin, is_active };
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

        const query = `
            INSERT INTO pelicula (nombre, duracion, clasificacion, imagen, fecha_inicio, fecha_fin, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [nombre, duracion, clasificacion, imagen, fecha_inicio, fecha_fin, is_active], (err, result) => {
            if (err) return reject(err);
            resolve({ message: 'Película creada correctamente', id: result.insertId, nombre, duracion, clasificacion, imagen, fecha_inicio, fecha_fin, is_active });
        });
    });
};

const updatePelicula = async (id, nuevosDatos) => {
    try {
        const peliculaExistente = await getPeliculaById(id);
        if (!peliculaExistente) throw { message: 'Película no encontrada' };

        const {
            nombre = peliculaExistente.nombre,
            duracion = peliculaExistente.duracion,
            clasificacion = peliculaExistente.clasificacion,
            imagen = peliculaExistente.imagen,
            fecha_inicio = peliculaExistente.fecha_inicio,
            fecha_fin = peliculaExistente.fecha_fin,
            is_active = peliculaExistente.is_active
        } = nuevosDatos;

        const query = `
            UPDATE pelicula
            SET nombre = ?, duracion = ?, clasificacion = ?, imagen = ?, fecha_inicio = ?, fecha_fin = ?, is_active = ?
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            db.query(query, [nombre, duracion, clasificacion, imagen, fecha_inicio, fecha_fin, is_active, id], (err) => {
                if (err) return reject(err);
                resolve({ message: 'Película actualizada correctamente' });
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

const deletePelicula = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM pelicula WHERE id = ?', [id], (err) => {
            if (err) return reject(err);
            resolve({ message: 'Película eliminada correctamente' });
        });
    });
};

module.exports = {
    getPeliculas,
    getPeliculaById,
    createPelicula,
    updatePelicula,
    deletePelicula
};
