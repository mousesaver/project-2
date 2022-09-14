'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_watchedmovies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users_watchedmovies.init({
    userId: DataTypes.INTEGER,
    watchedmovieId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_watchedmovies',
  });
  return users_watchedmovies;
};