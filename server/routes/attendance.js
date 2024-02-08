const express = require('express');

const router = express.Router();

const { Router } = require('express');
const attendaceController = require('../controllers/attendance');

router.get("/getAttendace/:date", attendaceController.getAttendance);

router.get("/attendanceReport", attendaceController.getAttendanceReport);

router.post('/markAttendance', attendaceController.postAttendance);


module.exports = router;