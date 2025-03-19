const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cine'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos.');
});

// Registrar usuario
app.post('/usuario', async (req, res) => {
    const { nombre, apellido} = req.body;
    const { username, password, role } = req.body;

    // Encriptar la contraseña antes de guardarla
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10); 
    console.log(hashedPassword);

    const query_perfil = 'INSERT INTO perfil (nombre, apellido) VALUES (?, ?)';
    db.query(query_perfil, [nombre, apellido], (err, result_perfil) => {
      if (err) return res.status(400).json(err);
      else if(!result_perfil.insertId) return res.status(400).json({ message: 'No se pudo crear el perfil.' });
      const query_usuario = 'INSERT INTO usuarios (username, password, role, perfil_id) VALUES (?, ?, ?, ?)';
      db.query(query_usuario, [username, hashedPassword, role, result_perfil.insertId], (err, result) => {
        if (err) return res.status(400).json(err);
        res.status(201).json({ id: result.insertId, username, role, perfil_id: result_perfil.insertId, perfil:{id: result_perfil.insertId, nombre, apellido} });
      });
  });

    
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Buscar al usuario en la base de datos
    const query = 'SELECT * FROM usuarios WHERE username = ?';
    db.query(query, [username], async (err, results) => {
      console.log(results);
        if (err) return res.status(500).json({ message: 'Error en el servidor.' });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        // Comparar la contraseña con la almacenada en la base de datos
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user)

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        // Crear un token JWT
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secreto', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token });
    });
});

// Middleware para proteger rutas
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    jwt.verify(token, 'secreto', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido.' });
        }
        req.user = user;
        next();
    });
};

// Ejemplo de una ruta protegida
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
