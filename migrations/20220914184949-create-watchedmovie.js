'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('watchedmovies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      poster: {
        type: Sequelize.STRING
      },
      director: {
        type: Sequelize.STRING
      },
      imdbId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('watchedmovies');
  }
};