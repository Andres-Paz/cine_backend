const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async ({ username, password }) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE username = ?';
        db.query(query, [username], async (err, results) => {
            if (err) return reject({ message: 'Error en el servidor.' });
            if (results.length === 0) return reject({ message: 'Credenciales inválidas.' });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return reject({ message: 'Credenciales inválidas.' });

            const queryPerfil = `SELECT * FROM perfil WHERE id = ?`;
            db.query(queryPerfil, [user.perfil_id], (err, results) => {
                if (err) return reject({ message: 'Error en el servidor.' });
                if (results.length === 0) return reject({ message: 'Perfil no encontrado.' });

                const perfil = results[0];

                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                resolve({
                    data: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        perfil: perfil
                    },
                    token: token
                });
            });
        });
    });
};

module.exports = { loginUser };