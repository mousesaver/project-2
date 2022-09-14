'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_watchlists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  users_watchlists.init({
    userId: DataTypes.INTEGER,
    watchlistId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_watchlists',
  });
  return users_watchlists;
};