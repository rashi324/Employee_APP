import { useState } from "react";

function Salary() {
  const [basicSalary, setBasicSalary] = useState("");
  const [leaveDays, setLeaveDays] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [finalSalary, setFinalSalary] = useState(null);

  const calculateSalary = () => {
    const perDaySalary = basicSalary / 30;
    const leaveDeduction = perDaySalary * leaveDays;
    const overtimeBonus = overtimeHours * 200; // ₹200 per hour
    const total = basicSalary - leaveDeduction + overtimeBonus;

    setFinalSalary(total.toFixed(2));
  };

  return (
    <div style={styles.container}>
      <h1></h1>

      <div style={styles.card}>
        <h3>Calculate Salary</h3>

        <input
          style={styles.input}
          type="number"
          placeholder="Basic Salary"
          value={basicSalary}
          onChange={(e) => setBasicSalary(Number(e.target.value))}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Leave Days"
          value={leaveDays}
          onChange={(e) => setLeaveDays(Number(e.target.value))}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Overtime Hours"
          value={overtimeHours}
          onChange={(e) => setOvertimeHours(Number(e.target.value))}
        />

        <button style={styles.button} onClick={calculateSalary}>
          Calculate
        </button>

        {finalSalary && (
          <div style={styles.result}>
            <h3>Final Salary: ₹ {finalSalary}</h3>
          </div>
        )}
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
    maxWidth: "400px",
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
  result: {
    marginTop: "20px",
    background: "#f3f0ff",
    padding: "15px",
    borderRadius: "6px",
    textAlign: "center",
  },
};

export default Salary;
