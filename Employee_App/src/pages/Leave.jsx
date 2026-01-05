import { useState } from "react";

function Leave() {
  const [leaveType, setLeaveType] = useState("Casual");
  const [days, setDays] = useState("");
  const [leaveList, setLeaveList] = useState([]);

  const applyLeave = () => {
    if (!days) {
      alert("Enter number of leave days");
      return;
    }

    const newLeave = {
      id: Date.now(),
      type: leaveType,
      days,
      status: "Pending",
    };

    setLeaveList([newLeave, ...leaveList]);
    setDays("");
  };

  const updateStatus = (id, status) => {
    setLeaveList(
      leaveList.map((leave) =>
        leave.id === id ? { ...leave, status } : leave
      )
    );
  };

  return (
    <div style={styles.container}>
      <h1></h1>

      {/* APPLY LEAVE */}
      <div style={styles.card}>
        <h3>Apply Leave</h3>

        <select
          style={styles.input}
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option>Casual</option>
          <option>Sick</option>
          <option>Paid</option>
          <option>Unpaid</option>
        </select>

        <input
          style={styles.input}
          type="number"
          placeholder="Number of Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <button style={styles.button} onClick={applyLeave}>
          Apply Leave
        </button>
      </div>

      {/* LEAVE RECORDS */}
      <div style={styles.card}>
        <h3>Leave Requests</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Days</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveList.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.type}</td>
                <td>{leave.days}</td>
                <td>{leave.status}</td>
                <td>
                  <button
                    style={styles.approve}
                    onClick={() => updateStatus(leave.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    style={styles.reject}
                    onClick={() => updateStatus(leave.id, "Rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px" },
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
  approve: {
    marginRight: "5px",
    padding: "6px 10px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  reject: {
    padding: "6px 10px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Leave;
