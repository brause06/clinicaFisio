const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Ejercicio = sequelize.define('Ejercicio', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    clienteId: DataTypes.INTEGER,
    fisioterapeutaId: DataTypes.INTEGER,
    fotoUrl: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    esPrecargado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    realizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  
  Ejercicio.associate = (models) => {
    Ejercicio.belongsTo(models.Usuario, { as: 'Cliente', foreignKey: 'clienteId' });
    Ejercicio.belongsTo(models.Usuario, { as: 'Fisioterapeuta', foreignKey: 'fisioterapeutaId' });
    Ejercicio.hasMany(models.EjercicioRealizado, { foreignKey: 'ejercicioId' });
  };

  return Ejercicio;
};
