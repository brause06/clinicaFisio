const express = require('express');
const auth = require('../middleware/auth');
const { Usuario, Cita } = require('../../models');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// Obtener todos los clientes
router.get('/clientes', auth, checkRole(['admin']), async (req, res, next) => {
  try {
    const clientes = await Usuario.findAll({
      where: { role: 'cliente' },
      attributes: ['id', 'nombre', 'apellido', 'email']
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
});

// Obtener todas las citas
router.get('/citas', auth, checkRole(['admin']), async (req, res, next) => {
  try {
    const citas = await Cita.findAll({
      include: [
        { model: Usuario, as: 'Cliente', attributes: ['nombre', 'apellido'] },
        { model: Usuario, as: 'Fisioterapeuta', attributes: ['nombre', 'apellido'] }
      ],
      order: [['fecha', 'ASC']]
    });
    res.json(citas);
  } catch (error) {
    next(error);
  }
});

// Obtener citas de un cliente específico
router.get('/citas/:clienteId', auth, checkRole(['admin']), async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const citas = await Cita.findAll({
      where: { clienteId },
      include: [
        { model: Usuario, as: 'Cliente', attributes: ['nombre', 'apellido'] },
        { model: Usuario, as: 'Fisioterapeuta', attributes: ['nombre', 'apellido'] }
      ],
      order: [['fecha', 'ASC']]
    });
    res.json(citas);
  } catch (error) {
    next(error);
  }
});

// Crear una nueva cita
router.post('/citas', auth, checkRole(['admin']), async (req, res, next) => {
  try {
    const { clienteId, fisioterapeutaId, fecha } = req.body;
    const nuevaCita = await Cita.create({ clienteId, fisioterapeutaId, fecha });
    res.status(201).json(nuevaCita);
  } catch (error) {
    next(error);
  }
});

// Actualizar una cita
router.put('/citas/:citaId', auth, checkRole(['admin']), async (req, res, next) => {
  try {
    const { citaId } = req.params;
    const { clienteId, fisioterapeutaId, fecha } = req.body;
    const [updated] = await Cita.update(
      { clienteId, fisioterapeutaId, fecha },
      { where: { id: citaId } }
    );
    if (updated) {
      const updatedCita = await Cita.findByPk(citaId);
      res.json(updatedCita);
    } else {
      res.status(404).json({ error: 'Cita no encontrada' });
    }
  } catch (error) {
    next(error);
  }
});

// Eliminar una cita
router.delete('/citas/:citaId', auth, checkRole(['admin']), async (req, res, next) => {
  try {
    const { citaId } = req.params;
    const deleted = await Cita.destroy({ where: { id: citaId } });
    if (deleted) {
      res.json({ mensaje: 'Cita eliminada con éxito' });
    } else {
      res.status(404).json({ error: 'Cita no encontrada' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
