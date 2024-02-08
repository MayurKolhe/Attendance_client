
const express = require("express");
const Attendance = require("./models/attendance");
const Student = require('./models/students');
const cors = require("cors");
const app = express();
const sequelize = require("./util/db");
const attendanceRoutes = require("./routes/attendance");


app.use(cors());

app.use(express.json());

Attendance.belongsTo(Student);
Student.hasMany(Attendance);

const studentData = [
    { name: 'Siva' },
    { name: 'Rajesh' },
    { name: 'Ashok' },
    { name: 'Sai' },
    { name: 'Haritha' },
    { name: 'Ram' },
    { name: 'Krishna' },
    { name: 'Anu' },
    { name: 'Ammu' },
    { name: 'Adi' },
    { name: 'Venkat' },
]

app.use(attendanceRoutes);

sequelize
    .sync().then(() => {
        return Student.findByPk(1);
    }).then((student) => {
        if (!student) {
          return Student.bulkCreate(studentData);
      }
  })
  .then(() => {
      app.listen(3000);
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
    process.exit(1);
  });


