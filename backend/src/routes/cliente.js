const express = require('express');
const auth = require('../middleware/auth');
const { Historial, Usuario, Cita, Ejercicio, EjercicioRealizado } = require('../../models');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// Obtener historial del cliente
router.get('/historial', auth, async (req, res, next) => {
  try {
    const clienteId = req.usuario.id;
    const historial = await EjercicioRealizado.findAll({
      where: { clienteId },
      include: [{
        model: Ejercicio,
        attributes: ['nombre', 'descripcion']
      }],
      order: [['fecha', 'DESC']]
    });
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial de ejercicios:', error);
    next(error);
  }
});

// Obtener ejercicios del cliente
router.get('/ejercicios', auth, async (req, res) => {
  try {
    const ejercicios = await Ejercicio.findAll({
      where: { clienteId: req.usuario.id },
      attributes: ['id', 'nombre', 'descripcion', 'fotoUrl', 'videoUrl', 'realizado'],
    });
    res.json(ejercicios);
  } catch (error) {
    console.error('Error al obtener ejercicios del cliente:', error);
    res.status(500).json({ message: 'Error al obtener ejercicios' });
  }
});

// Obtener citas del cliente
router.get('/citas', auth, async (req, res, next) => {
  try {
    const clienteId = req.usuario.id;
    const citas = await Cita.findAll({
      where: { clienteId },
      include: [
        { 
          model: Usuario, 
          as: 'Fisioterapeuta', 
          attributes: ['id', 'nombre', 'apellido'] 
        }
      ],
      order: [['fecha', 'ASC']]
    });
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    next(error);
  }
});

// Obtener progreso de ejercicios del cliente
router.get('/ejercicios/progreso', auth, async (req, res, next) => {
  try {
    const clienteId = req.usuario.id;
    const ejercicios = await Ejercicio.findAll({
      where: { clienteId },
      include: [{
        model: EjercicioRealizado,
        attributes: ['id']
      }],
      attributes: ['id', 'nombre']
    });

    const progreso = ejercicios.map(ejercicio => ({
      nombre: ejercicio.nombre,
      asignados: 1,
      realizados: ejercicio.EjercicioRealizados.length
    }));

    res.json(progreso);
  } catch (error) {
    next(error);
  }
});

// Marcar ejercicio como realizado
router.post('/ejercicios/:ejercicioId/realizado', auth, async (req, res, next) => {
  try {
    const { ejercicioId } = req.params;
    const clienteId = req.usuario.id;

    const ejercicio = await Ejercicio.findOne({
      where: { id: ejercicioId, clienteId: clienteId }
    });

    if (!ejercicio) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    const ejercicioRealizado = await EjercicioRealizado.create({
      ejercicioId: ejercicioId,
      clienteId: clienteId,
      fecha: new Date()
    });

    ejercicio.realizado = true;
    await ejercicio.save();

    res.json({ message: 'Ejercicio marcado como realizado', ejercicio, ejercicioRealizado });
  } catch (error) {
    console.error('Error al marcar ejercicio como realizado:', error);
    next(error);
  }
});

module.exports = router;
