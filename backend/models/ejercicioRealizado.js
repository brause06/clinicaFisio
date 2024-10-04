'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EjercicioRealizado extends Model {
    static associate(models) {
      EjercicioRealizado.belongsTo(models.Ejercicio, { foreignKey: 'ejercicioId' });
      EjercicioRealizado.belongsTo(models.Usuario, { as: 'Cliente', foreignKey: 'clienteId' });
    }
  }
  EjercicioRealizado.init({
    fecha: DataTypes.DATE,
    ejercicioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Ejercicios',
        key: 'id'
      }
    },
    clienteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'EjercicioRealizado',
    tableName: 'EjerciciosRealizados', // Asegúrate de que el nombre de la tabla sea correcto
  });
  return EjercicioRealizado;
};
