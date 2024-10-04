'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Ejercicios', [
      {
        nombre: 'Estiramiento de cuádriceps',
        descripcion: 'De pie, dobla una rodilla y lleva el talón hacia el glúteo. Mantén 30 segundos.',
        esPreCargado: true,
        fotoUrl: 'https://www.entrenamientos.com/media/cache/exercise_375/uploads/exercise/media-sentadilla-init-pos-1882.png',
        videoUrl: 'https://ejemplo.com/videos/estiramiento-cuadriceps.mp4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Elevación de pierna recta',
        descripcion: 'Acostado boca arriba, levanta una pierna recta hasta 45 grados. Mantén 5 segundos y baja lentamente.',
        esPreCargado: true,
        fotoUrl: 'https://www.entrenamientos.com/media/cache/exercise_375/uploads/exercise/media-sentadilla-init-pos-1882.png',
        videoUrl: 'https://youtu.be/VRKdOsad3HQ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Añade más ejercicios precargados aquí...
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Ejercicios', { esPreCargado: true }, {});
  }
};
