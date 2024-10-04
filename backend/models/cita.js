'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Cita = sequelize.define('Cita', {
    fecha: DataTypes.DATE,
    clienteId: DataTypes.INTEGER,
    fisioterapeutaId: DataTypes.INTEGER
  });

  Cita.associate = function(models) {
    Cita.belongsTo(models.Usuario, { as: 'Cliente', foreignKey: 'clienteId' });
    Cita.belongsTo(models.Usuario, { as: 'Fisioterapeuta', foreignKey: 'fisioterapeutaId' });
  };

  return Cita;
};