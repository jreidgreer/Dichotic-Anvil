var Sequelize = require('sequelize');
module.exports = new Sequelize({
  database: 'postgres://localhost:3000/borrow', 
  username: 'Reid',
  options: {
    dialect: 'postgres'
  }
});