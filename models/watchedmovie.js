'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class watchedmovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.watchedmovie.belongsToMany(models.user, {through : "users_watchedmovies"})
    }
  }
  watchedmovie.init({
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    poster: DataTypes.STRING,
    director: DataTypes.STRING,
    imdbId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'watchedmovie',
  });
  return watchedmovie;
};