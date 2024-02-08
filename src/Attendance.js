import React, { useEffect, useState } from "react";

import ReportGenration from "./ReportGenration";

const getInitialDate = () => {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(getInitialDate());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceCheck, setAttendanceCheck] = useState({});
  const [showReport, setShowReport] = useState(false);

  const handleChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/getAttendace/${currentDate}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        const { attendanceData, studentData } = data;

        setStudents(studentData);
        if (attendanceData.length > 0) {
          setAttendance(attendanceData);
        } else {
          setAttendance(null);
        }
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const attendanceData = students.map((student) => {
        return {
          student_id: student.id,
          status: attendanceCheck[student.id] || "Absent",
        };
      });

      const response = await fetch("http://localhost:3000/markAttendance", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          date: currentDate,
          attendance: attendanceData,
        }),
      });

      console.log(response.ok);
      if (response.ok) {
        await fetchAttendanceData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlechangeCheckBox = (studentId, value) => {
    setAttendanceCheck((prevState) => ({
      ...prevState,
      [studentId]: value,
    }));
  };

  const Attendance_Report = () => {
    setShowReport(true);
  };

  const handleReportClose = () => {
    setShowReport(false);
  }

  useEffect(() => {
    fetchAttendanceData();
  }, [currentDate]);

  return (
    <div className="container mx-auto p-4">
      {showReport ? (
        <ReportGenration onClose={handleReportClose} />
      ) : (
        <div>
          <button
            className="mb-10 mr-4 p-2 absolute top-20 right-40 h-10 bg-green-500 rounded"
            onClick={Attendance_Report}
          >
            Genrate Report
          </button>
          <form onSubmit={(e) => e.preventDefault()} className="mb-4">
            <input
              type="date"
              name="selectedDate"
              value={currentDate}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={fetchAttendanceData}
              className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
          </form>
          <div>
            <h2 className="text-2xl font-bold mb-4">Student List:</h2>
            {attendance ? (
              <div>
                <table className="w-full border border-collapse border-gray-300 mb-4">
                  <thead>
                    <tr>
                      <th className="p-2 border border-gray-300">
                        Student Name
                      </th>
                      <th className="p-2 border border-gray-300">
                        Attendance status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((entry) => {
                      return (
                        <tr key={entry.studentId}>
                          <td className="p-2 border border-gray-300">
                            {
                              students.find(
                                (student) => student.id === entry.studentId
                              )?.name
                            }
                          </td>
                          <td className="p-2 border border-gray-300">
                            {entry.attend_status ? "✅ present" : "❌ absent"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <table className="w-full border border-collapse border-gray-300 mb-4">
                  <thead>
                    <tr>
                      <th className="p-2 border border-gray-300">Name</th>
                      <th className="p-2 border border-gray-300">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="p-2 border border-gray-300">
                          {" "}
                          {student.name}
                        </td>
                        <td className="p-2 border border-gray-300">
                          <label className="inline-flex items-center ml-4">
                            <input
                              type="checkbox"
                              name={`attendance_${student.id}`}
                              checked={
                                attendanceCheck[student.id] === "Present"
                              }
                              value="Present"
                              onChange={() =>
                                handlechangeCheckBox(student.id, "Present")
                              }
                            />
                            <span className="ml-2">Present</span>
                          </label>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <label className="inline-flex items-center ml-4">
                            <input
                              type="checkbox"
                              name={`attendance_${student.id}`}
                              value="Absent"
                              checked={attendanceCheck[student.id] === "Absent"}
                              onChange={() =>
                                handlechangeCheckBox(student.id, "Absent")
                              }
                            />
                            <span className="ml-2">Absent</span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleMarkAttendance}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Mark Attendance
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
