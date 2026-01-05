import { useEffect, useState } from "react";

function Attendance() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("Present");

  // 🔹 Fetch attendance records (frontend demo / later backend)
  useEffect(() => {
    // later you will replace this with API call
    setAttendanceList([
      {
        id: 1,
        employeeId: "EMP001",
        date: "2025-01-01",
        status: "Present",
      },
      {
        id: 2,
        employeeId: "EMP002",
        date: "2025-01-01",
        status: "Absent",
      },
    ]);
  }, []);

  // 🔹 Mark Attendance
  const markAttendance = () => {
    if (!employeeId) {
      alert("Please enter Employee ID");
      return;
    }

    const newRecord = {
      id: Date.now(),
      employeeId,
      date: new Date().toLocaleDateString(),
      status,
    };

    setAttendanceList([newRecord, ...attendanceList]);
    setEmployeeId("");
    setStatus("Present");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}></h1>

      {/* MARK ATTENDANCE */}
      <div style={styles.card}>
        <h3>Mark Attendance</h3>

        <input
          style={styles.input}
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />

        <select
          style={styles.input}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Leave">Leave</option>
        </select>

        <button style={styles.button} onClick={markAttendance}>
          Submit
        </button>
      </div>

      {/* ATTENDANCE LIST */}
      <div style={styles.card}>
        <h3>Attendance Records</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((item) => (
              <tr key={item.id}>
                <td>{item.employeeId}</td>
                <td>{item.date}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },
  heading: {
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#6a5acd",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default Attendance;
