import { useEffect, useState } from "react";

const ReportGenration = ({ onClose }) => {
  const [reportdata, setReportData] = useState([]);

  const handleGenrateReport = async () => {
    try {
      const response = await fetch(`http://localhost:3000/attendanceReport`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGenrateReport();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="p-4 relative inset-x-0 top-0 h-16">
        Welcome to Report Page
      </h1>
      <table className="w-full border border-collapse border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="p-2 border border-gray-300">Name</th>
            <th className="p-2 border border-gray-300">TotalDays</th>
            <th className="p-2 border border-gray-300">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {reportdata.map((record) => {
            return (
              <tr key={record.name}>
                <td className="p-2 border border-gray-300">{record.name}</td>
                <td className="p-2 border border-gray-300">
                  {record.attend_days}
                </td>
                <td className="p-2 border border-gray-300">
                  {record.attend_percent}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="mb-10 mr-4 p-2 absolute top-10 right-40 h-10 bg-red-500 rounded"
        onClick={() => onClose()}
      >
        Close
      </button>
    </div>
  );
};

export default ReportGenration;
