'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class watchlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.watchlist.belongsToMany(models.user, {through : "users_watchlists"})
    }
  }
  watchlist.init({
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    poster: DataTypes.STRING,
    director: DataTypes.STRING,
    imdbId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'watchlist',
  });
  return watchlist;
};