const Sequelize = require('sequelize');
// postgres server Connection
const sequelize = new Sequelize('basic_db', 'postgres', '23Feb!986', {
  'dialect': 'postgres'
});

const db = {}

db.user = sequelize.import('./users');
db.entries = sequelize.import('./entries');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.user.belongsToMany(db.entries, { through:'yelp', foreignKey: 'eventId'});
// db.entries.belongsToMany(db.user, { through:'yelp', foreignKey: 'attend_users'});

module.exports = db;
