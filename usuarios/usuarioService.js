const db = require('../config/db');
const bcrypt = require('bcrypt');

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.id, u.username, u.role,
                   p.id AS perfil_id, p.nombre, p.apellido
            FROM usuarios u
            INNER JOIN perfil p ON u.perfil_id = p.id
        `;
        db.query(query, (err, results) => {
            if (err) return reject(err);

            const users = results.map(user => ({
                id: user.id,
                username: user.username,
                role: user.role,
                perfil: {
                    id: user.perfil_id,
                    nombre: user.nombre,
                    apellido: user.apellido
                }
            }));

            resolve(users);
        });
    });
};

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

const getCurrentUserWithProfile = async (userId) => {
    return new Promise((resolve, reject) => {
        const query =`
            SELECT u.id, u.username, u.role,
                   p.id AS perfil_id, p.nombre, p.apellido
            FROM usuarios u
            INNER JOIN perfil p ON u.perfil_id = p.id
            WHERE u.id = ?`
        ;
        db.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject({ message: 'Usuario no encontrado.' });

            const user = results[0];
            resolve({
                id: user.id,
                username: user.username,
                role: user.role,
                perfil: {
                    id: user.perfil_id,
                    nombre: user.nombre,
                    apellido: user.apellido
                }
            });
        });
    });
};

module.exports = {
    createUser,
    getCurrentUserWithProfile,
    getAllUsers
};
