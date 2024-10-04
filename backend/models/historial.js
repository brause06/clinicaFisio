'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historial extends Model {
    static associate(models) {
      Historial.belongsTo(models.Usuario, { as: 'Cliente', foreignKey: 'clienteId' });
      Historial.belongsTo(models.Usuario, { as: 'Fisioterapeuta', foreignKey: 'fisioterapeutaId' });
    }
  }

  Historial.init({
    fecha: DataTypes.DATE,
    notas: DataTypes.TEXT,
    clienteId: DataTypes.INTEGER,
    fisioterapeutaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Historial',
  });

  return Historial;
};