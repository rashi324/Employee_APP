import React, { useState, useEffect } from 'react';

function Attendance() {
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAttendance = async () => {
    if (!employeeId) return;
    try {
      const response = await fetch(`http://localhost:5000/attendance/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setMessage("Error fetching attendance.");
    }
  };

  const handleClockAction = async (action) => {
    if (!employeeId) {
      setMessage("Please enter Employee ID.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emp_id: parseInt(employeeId), action }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchAttendance(); // Refresh attendance records
      } else {
        setMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      setMessage(`Error during ${action}.`);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId]);

  return (
    <div>
      <h2>Attendance Tracking</h2>
      <div>
        <input
          type="number"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <button onClick={() => handleClockAction("clock_in")}>Clock In</button>
        <button onClick={() => handleClockAction("clock_out")}>Clock Out</button>
      </div>
      {message && <p>{message}</p>}

      <h3>Attendance Records for Employee ID: {employeeId}</h3>
      {attendanceRecords.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record[0]}>
                <td>{record[2]}</td> {/* date */}
                <td>{record[3] ? new Date(record[3]).toLocaleTimeString() : 'N/A'}</td> {/* clock_in */}
                <td>{record[4] ? new Date(record[4]).toLocaleTimeString() : 'N/A'}</td> {/* clock_out */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
}

export default Attendance;
