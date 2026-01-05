function Reports() {
  return (
    <div style={styles.container}>
      <h1>Reports</h1>

      <div style={styles.card}>
        <h3>Available Reports</h3>

        <ul style={styles.list}>
          <li>📅 Attendance Report</li>
          <li>💰 Salary Report</li>
          <li>🌴 Leave Report</li>
        </ul>

        <button style={styles.button}>Export CSV</button>
        <button style={styles.button}>Export PDF</button>
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
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
  },
  list: {
    marginBottom: "20px",
    paddingLeft: "20px",
  },
  button: {
    marginRight: "10px",
    padding: "10px 16px",
    background: "#6a5acd",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Reports;
