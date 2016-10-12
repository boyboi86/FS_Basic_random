const sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
  const entries = sequelize.define('entries', {
    location_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    displayUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    snippets: {
      type: DataTypes.STRING
    }
  })
  return entries
}
