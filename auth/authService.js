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

            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secreto', { expiresIn: '1h' });
            resolve({ message: 'Login exitoso', token });
        });
    });
};

module.exports = { loginUser };