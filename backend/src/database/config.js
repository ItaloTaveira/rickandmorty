const Sequelize = require('sequelize');
const sequelize = new Sequelize('rickandmorty', 'root', 'password', {dialect: 'mysql', host: 'mysql'});

//verifica conexão
var conn = sequelize.authenticate()
    .then(()=>{
        console.log('Connection established!');
    })
    .catch(()=>{
        console.log('Connection fail');
    })

var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;