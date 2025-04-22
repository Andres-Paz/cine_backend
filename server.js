require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const privateRoutes = require('./routes/private');
const salaRoutes = require('./routes/salas');
const reservaRoutes = require('./routes/reservas');
const funcionRoutes = require('./routes/funciones');
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/private', privateRoutes);
app.use('/salas', salaRoutes);
app.use('/reservas', reservaRoutes);
app.use('/funciones', funcionRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});