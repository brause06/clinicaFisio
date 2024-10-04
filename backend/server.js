require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Cita } = require('./models');
const auth = require('./src/middleware/auth');
const authRoutes = require('./src/routes/auth');
const fisioterapeutaRoutes = require('./src/routes/fisioterapeuta');
const clienteRoutes = require('./src/routes/cliente');
const errorHandler = require('./src/middleware/errorHandler');
const checkRole = require('./src/middleware/checkRole');
const adminRoutes = require('./src/routes/admin');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Ajusta esto a la URL de tu frontend
  credentials: true
}));
app.use(express.json());

// Rutas de Autenticación
app.use('/api/auth', authRoutes);

// Rutas de Fisioterapeuta
app.use('/api/fisioterapeuta', fisioterapeutaRoutes);

// Rutas de Cliente
app.use('/api/cliente', clienteRoutes);

// Rutas de Administrador
app.use('/api/admin', adminRoutes);

// Actualizar una cita
app.put('/api/citas/:id', auth, async (req, res) => {
  try {
    const { fecha } = req.body;
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    cita.fecha = fecha;
    await cita.save();
    res.json(cita);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar cita' });
  }
});

// Eliminar una cita
app.delete('/api/citas/:id', auth, async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    await cita.destroy();
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'Ocurrió un error en el servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Usar el middleware de manejo de errores al final
app.use(errorHandler);

// Sincronizar la base de datos y arrancar el servidor
const PORT = process.env.PORT || 5001;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
});

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

console.log('JWT_SECRET está configurado:', !!process.env.JWT_SECRET);
