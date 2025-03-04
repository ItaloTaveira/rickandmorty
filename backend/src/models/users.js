const {sequelize, Sequelize} = require('../database/config');

//modelo da tabela users
var users = sequelize.define('users', {
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Email deve ser único
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//export
module.exports = {users};