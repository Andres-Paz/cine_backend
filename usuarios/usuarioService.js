const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async ({ nombre, apellido, username, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
        const query_perfil = 'INSERT INTO perfil (nombre, apellido) VALUES (?, ?)';
        db.query(query_perfil, [nombre, apellido], (err, result_perfil) => {
            if (err) return reject(err);
            if (!result_perfil.insertId) return reject({ message: 'No se pudo crear el perfil.' });
            
            const query_usuario = 'INSERT INTO usuarios (username, password, role, perfil_id) VALUES (?, ?, ?, ?)';
            db.query(query_usuario, [username, hashedPassword, role, result_perfil.insertId], (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, username, role, perfil_id: result_perfil.insertId, perfil: { id: result_perfil.insertId, nombre, apellido } });
            });
        });
    });
};

module.exports = { createUser };