'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.belongsToMany(models.watchedmovie, {through : "users_watchedmovies"})
      models.user.belongsToMany(models.watchlist, {through : "users_watchlists"})
      models.user.hasMany(models.comment)
    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};