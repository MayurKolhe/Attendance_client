const Sequalize = require('sequelize');
const sequalize = require('../util/db');


const Attendance = sequalize.define("Attendance", {
    id: {
        type: Sequalize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    date: Sequalize.DATE,
    attend_status: Sequalize.BOOLEAN,
})

module.exports = Attendance;



