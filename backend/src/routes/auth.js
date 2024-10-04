const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario } = require('../../models');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// Registro de usuario
router.post('/registro', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).send({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Token generado:', token);
    res.json({ token, usuario: { id: usuario.id, role: usuario.role } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Listar todos los usuarios
router.get('/usuarios', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'email', 'role', 'nombre', 'apellido']
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

// Listar solo los clientes
router.get('/clientes', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const clientes = await Usuario.findAll({
      where: { role: 'cliente' },
      attributes: ['id', 'email', 'nombre', 'apellido']
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
});

// Listar solo los fisioterapeutas
router.get('/fisioterapeutas', auth, checkRole(['fisioterapeuta']), async (req, res, next) => {
  try {
    const fisioterapeutas = await Usuario.findAll({
      where: { role: 'fisioterapeuta' },
      attributes: ['id', 'email', 'nombre', 'apellido']
    });
    res.json(fisioterapeutas);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
