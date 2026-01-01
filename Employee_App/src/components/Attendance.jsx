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
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const time = new Date(timeString);
    return time.toLocaleTimeString();
  };

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
              <tr key={record.id}>
                <td>{formatDate(record.date)}</td>
                <td>{formatTime(record.clock_in)}</td>
                <td>{formatTime(record.clock_out)}</td>
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
