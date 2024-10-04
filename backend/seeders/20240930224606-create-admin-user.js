'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const [user, created] = await queryInterface.sequelize.query(
        `INSERT INTO Usuarios (nombre, apellido, email, password, role, createdAt, updatedAt)
         VALUES (:nombre, :apellido, :email, :password, :role, :createdAt, :updatedAt)
         ON CONFLICT (email) DO UPDATE SET
         nombre = :nombre,
         apellido = :apellido,
         password = :password,
         role = :role,
         updatedAt = :updatedAt`,
        {
          replacements: {
            nombre: 'Admin',
            apellido: 'User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error('Error en el seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', { email: 'admin@example.com' }, {});
  }
};
