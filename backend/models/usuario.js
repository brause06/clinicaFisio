'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Historial, { foreignKey: 'clienteId', as: 'HistorialesCliente' });
      Usuario.hasMany(models.Historial, { foreignKey: 'fisioterapeutaId', as: 'HistorialesFisioterapeuta' });
      Usuario.hasMany(models.Ejercicio, { foreignKey: 'clienteId' });
      Usuario.hasMany(models.Cita, { foreignKey: 'clienteId', as: 'CitasCliente' });
      Usuario.hasMany(models.Cita, { foreignKey: 'fisioterapeutaId', as: 'CitasFisioterapeuta' });
      Usuario.hasMany(models.EjercicioRealizado, { foreignKey: 'clienteId' });
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  Usuario.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('cliente', 'fisioterapeuta', 'admin'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  return Usuario;
};