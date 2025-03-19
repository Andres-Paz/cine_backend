require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const privateRoutes = require('./routes/private');
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/private', privateRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});