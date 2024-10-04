const express = require('express');
const auth = require('../middleware/auth');
const { Usuario, Ejercicio, EjercicioRealizado, Historial, Cita } = require('../../models');
const checkRole = require('../middleware/checkRole');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegúrate de que la carpeta 'uploads' exista
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination function called');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log('Filename function called');
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Obtener lista de clientes
router.get('/clientes', auth, checkRole(['fisioterapeuta']), async (req, res) => {
  console.log('Solicitud recibida para obtener clientes');
  console.log('Usuario autenticado:', req.user);
  try {
    const clientes = await Usuario.findAll({
      where: { role: 'cliente' },
      attributes: ['id', 'nombre', 'apellido', 'email'] // Ajusta esto según tus necesidades
    });
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
});

// Obtener historial de un cliente específico
router.get('/historial/:clienteId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const historial = await Historial.findAll({
      where: { 
        clienteId: clienteId,
        fisioterapeutaId: req.usuario.id
      },
      order: [['fecha', 'DESC']]
    });
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    next(error);
  }
});

// Obtener ejercicios de un cliente específico
router.get('/ejercicios/:clienteId', auth, checkRole(['fisioterapeuta']), async (req, res) => {
  console.log('Solicitud recibida para obtener ejercicios');
  console.log('req.user:', req.user);
  console.log('req.params:', req.params);
  
  try {
    const { clienteId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const fisioterapeutaId = req.user.id;

    // Obtener ejercicios asignados al cliente
    const ejercicios = await Ejercicio.findAll({
      where: { 
        clienteId, 
        fisioterapeutaId,
        esPreCargado: false // Asegurarse de que no son ejercicios precargados
      },
      include: [{ 
        model: EjercicioRealizado,
        attributes: ['id', 'fecha'],
        required: false
      }],
      order: [[EjercicioRealizado, 'fecha', 'DESC']]
    });

    // Obtener ejercicios precargados
    const ejerciciosPreCargados = await Ejercicio.findAll({
      where: { esPreCargado: true },
      attributes: ['id', 'nombre', 'descripcion', 'fotoUrl', 'videoUrl']
    });

    console.log('Ejercicios asignados encontrados:', ejercicios.length);
    console.log('Ejercicios precargados:', ejerciciosPreCargados.length);
    
    res.json({
      ejerciciosAsignados: ejercicios,
      ejerciciosPreCargados: ejerciciosPreCargados
    });
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    res.status(500).json({ message: 'Error al obtener ejercicios', error: error.message });
  }
});

// Agregar un nuevo ejercicio a un cliente
router.post('/ejercicios/:clienteId', auth, checkRole('fisioterapeuta'), async (req, res) => {
  try {
    const { clienteId } = req.params;
    const { nombre, descripcion, fotoUrl, videoUrl } = req.body;
    
    const fisioterapeutaId = req.user.id;

    const nuevoEjercicio = await Ejercicio.create({
      nombre,
      descripcion,
      fotoUrl,
      videoUrl,
      clienteId,
      fisioterapeutaId
    });

    res.status(201).json(nuevoEjercicio);  // Envía el ejercicio creado como respuesta
  } catch (error) {
    console.error('Error al crear ejercicio:', error);
    res.status(500).json({ message: 'Error al crear ejercicio', error: error.message });
  }
});

// Editar un ejercicio existente
router.put('/ejercicios/:clienteId/:ejercicioId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { ejercicio } = req.body;
    const [updated] = await Ejercicio.update(
      { 
        nombre: ejercicio.nombre,
        descripcion: ejercicio.descripcion,
        // Añade aquí otros campos que quieras actualizar
      },
      { 
        where: { 
          id: req.params.ejercicioId, 
          clienteId: req.params.clienteId 
        } 
      }
    );
    if (updated) {
      const updatedEjercicio = await Ejercicio.findByPk(req.params.ejercicioId);
      res.json(updatedEjercicio);
    } else {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar ejercicio:', error);
    res.status(500).json({ error: 'Error al actualizar ejercicio' });
  }
});

// Crear una nueva cita
router.post('/citas/:clienteId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const { fecha } = req.body;
    const nuevaCita = await Cita.create({
      fecha,
      clienteId,
      fisioterapeutaId: req.usuario.id,
    });
    res.status(201).json(nuevaCita);
  } catch (error) {
    console.error('Error al crear nueva cita:', error);
    next(error);
  }
});

router.get('/citas', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const citas = await Cita.findAll({
      where: { fisioterapeutaId: req.usuario.id },
      include: [{ model: Usuario, as: 'Cliente', attributes: ['nombre', 'apellido'] }],
      order: [['fecha', 'ASC']],
    });
    res.json(citas);
  } catch (error) {
    next(error);
  }
});

// Obtener citas de un cliente específico
router.get('/citas/:clienteId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const citas = await Cita.findAll({
      where: { 
        clienteId: clienteId,
        fisioterapeutaId: req.usuario.id 
      },
      include: [{ model: Usuario, as: 'Cliente', attributes: ['nombre', 'apellido'] }],
      order: [['fecha', 'ASC']],
    });
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas del cliente:', error);
    next(error);
  }
});

// Nueva ruta para borrar un ejercicio
router.delete('/ejercicios/:clienteId/:ejercicioId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { clienteId, ejercicioId } = req.params;
    const deleted = await Ejercicio.destroy({
      where: { 
        id: ejercicioId, 
        clienteId: clienteId,
        fisioterapeutaId: req.user.id // Asegurarse de que el fisioterapeuta sea el propietario del ejercicio
      }
    });

    if (deleted) {
      res.json({ mensaje: 'Ejercicio borrado con éxito' });
    } else {
      res.status(404).json({ error: 'Ejercicio no encontrado o no tienes permiso para borrarlo' });
    }
  } catch (error) {
    console.error('Error al borrar ejercicio:', error);
    next(error);
  }
});

// Ruta para obtener los ejercicios y su progreso
router.get('/ejercicios/progreso/:clienteId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const fisioterapeutaId = req.usuario.id;

    // Obtener todos los ejercicios asignados al cliente por este fisioterapeuta
    const ejercicios = await Ejercicio.findAll({
      where: { clienteId, fisioterapeutaId },
      include: [{
        model: EjercicioRealizado,
        attributes: ['id', 'fecha']
      }]
    });

    // Calcular el progreso
    const progreso = ejercicios.map(ejercicio => ({
      nombre: ejercicio.nombre,
      asignados: 1, // Cada ejercicio cuenta como 1 asignado
      realizados: ejercicio.EjerciciosRealizados ? ejercicio.EjerciciosRealizados.length : 0
    }));

    res.json(progreso);
  } catch (error) {
    console.error('Error al obtener progreso de ejercicios:', error);
    res.status(500).json({ 
      message: 'Error al obtener progreso de ejercicios', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Ruta para que el cliente marque un ejercicio como realizado
router.post('/ejercicios/realizado', auth, checkRole(['cliente']), async (req, res, next) => {
  try {
    const { ejercicioId } = req.body;
    const clienteId = req.usuario.id;

    const ejercicio = await Ejercicio.findOne({
      where: { id: ejercicioId, clienteId }
    });

    if (!ejercicio) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }

    const ejercicioRealizado = await EjercicioRealizado.create({
      ejercicioId,
      clienteId,
      fecha: new Date()
    });

    res.status(201).json(ejercicioRealizado);
  } catch (error) {
    console.error('Error al marcar ejercicio como realizado:', error);
    next(error);
  }
});

// Actualizar una cita existente
router.put('/citas/:citaId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { citaId } = req.params;
    const { fecha } = req.body;
    const [updated] = await Cita.update(
      { fecha },
      { where: { id: citaId, fisioterapeutaId: req.usuario.id } }
    );
    if (updated) {
      const updatedCita = await Cita.findByPk(citaId);
      res.json(updatedCita);
    } else {
      res.status(404).json({ error: 'Cita no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    next(error);
  }
});

// Eliminar una cita
router.delete('/citas/:citaId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { citaId } = req.params;
    const deleted = await Cita.destroy({
      where: { id: citaId, fisioterapeutaId: req.usuario.id }
    });
    if (deleted) {
      res.json({ mensaje: 'Cita eliminada con éxito' });
    } else {
      res.status(404).json({ error: 'Cita no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    next(error);
  }
});

// Asignar un ejercicio precargado a un cliente
router.post('/asignar-ejercicio/:clienteId', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const { ejercicioId } = req.body;
    
    console.log('Recibida solicitud para asignar ejercicio:', { clienteId, ejercicioId });
    console.log('req.user:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const ejercicioPreCargado = await Ejercicio.findOne({ where: { id: ejercicioId, esPreCargado: true } });
    if (!ejercicioPreCargado) {
      console.log('Ejercicio precargado no encontrado');
      return res.status(404).json({ message: 'Ejercicio precargado no encontrado' });
    }

    console.log('Ejercicio precargado encontrado:', ejercicioPreCargado);

    const nuevoEjercicio = await Ejercicio.create({
      nombre: ejercicioPreCargado.nombre,
      descripcion: ejercicioPreCargado.descripcion,
      clienteId: clienteId,
      fisioterapeutaId: req.user.id,
      fotoUrl: ejercicioPreCargado.fotoUrl,
      videoUrl: ejercicioPreCargado.videoUrl,
      esPreCargado: false
    });

    console.log('Nuevo ejercicio asignado:', nuevoEjercicio);
    res.status(201).json(nuevoEjercicio);
  } catch (error) {
    console.error('Error al asignar ejercicio precargado:', error);
    res.status(500).json({ message: 'Error al asignar ejercicio', error: error.message });
  }
});

// Nueva ruta para obtener ejercicios precargados
router.get('/ejercicios-precargados', auth, async (req, res) => {
  try {
    const ejerciciosPrecargados = await Ejercicio.findAll({
      where: { esPrecargado: true },
      attributes: ['id', 'nombre', 'descripcion', 'fotoUrl', 'videoUrl']
    });
    res.json(ejerciciosPrecargados);
  } catch (error) {
    console.error('Error al obtener ejercicios precargados:', error);
    res.status(500).json({ message: 'Error al obtener ejercicios precargados' });
  }
});

module.exports = router;