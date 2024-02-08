const Attendance = require("../models/attendance");
const { Op, fn, col } = require("sequelize");
const Student = require("../models/students");

exports.getAttendance = async (req, res, next) => {
  try {
    const currentDate = req.params.date;
    const attendanceData = await Attendance.findAll({
      where: {
        date: {
          [Op.eq]: new Date(currentDate),
        },
      },
    });
    const studentData = await Student.findAll();

    res.json({ attendanceData, studentData });
  } catch (err) {
    console.log(err);
  }
};

exports.getAttendanceReport = async (req, res, next) => {
  try {
    const student_records = await Student.findAll();
    const attendance_records = await Attendance.findAll();

    console.log(student_records);
    console.log(attendance_records);

    const attendance_Report = student_records.map((student) => {
      const totalDays = attendance_records.filter(
        (record) => record.studentId === student.id
      ).length;

      const totalPresentDays = attendance_records.filter(
        (record) =>
          record.studentId === student.id && record.attend_status === true
      ).length;

      const attendancePercentage =
        totalDays !== 0 ? (totalPresentDays / totalDays) * 100 : 0;

      return {
        name: student.name,
        attend_days: `${totalPresentDays}/${totalDays}`,
        attend_percent: `${attendancePercentage.toFixed(2)}%`,
      };
    });
    res.status(200).json(attendance_Report);
  } catch (error) {}
};

exports.postAttendance = (req, res, next) => {
  console.log(req.body);
  const date = req.body.date;
  const attendanceData = req.body.attendance;

  if (!date || !attendanceData || !Array.isArray(attendanceData)) {
    res.status(400).json({ error: "Invalid Request Body" });
  }

  Attendance.bulkCreate(
    attendanceData.map((record) => ({
      date: date,
      studentId: record.student_id,
      attend_status: record.status === "Present" ? true : false,
    }))
  )
    .then(() => {
      console.log("All Attendance are marked SucessFully");
      res.status(200).json({ message: "Attendance marked Successfully" });
    })
    .catch((error) => console.log(error));
};
