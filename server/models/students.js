const Sequalize = require("sequelize");

const sequalize = require('../util/db');



const Student = sequalize.define("student", {
    id: {
        type: Sequalize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: Sequalize.STRING,
});

module.exports = Student;