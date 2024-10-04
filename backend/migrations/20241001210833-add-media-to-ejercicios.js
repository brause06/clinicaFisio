'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Ejercicios', 'fotoUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Ejercicios', 'videoUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Ejercicios', 'esPreCargado', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Ejercicios', 'fotoUrl');
    await queryInterface.removeColumn('Ejercicios', 'videoUrl');
    await queryInterface.removeColumn('Ejercicios', 'esPreCargado');
  }
};
