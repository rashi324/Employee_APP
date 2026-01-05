import { useState } from "react";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");

  const addEmployee = () => {
    if (!name || !role || !salary) {
      alert("Fill all fields");
      return;
    }

    const newEmployee = {
      id: Date.now(),
      name,
      role,
      salary,
    };

    setEmployees([newEmployee, ...employees]);
    setName("");
    setRole("");
    setSalary("");
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1></h1>

      {/* ADD EMPLOYEE */}
      <div style={styles.card}>
        <h3>Add Employee</h3>

        <input
          style={styles.input}
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Basic Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <button style={styles.button} onClick={addEmployee}>
          Add Employee
        </button>
      </div>

      {/* EMPLOYEE LIST */}
      <div style={styles.card}>
        <h3>Employee List</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.role}</td>
                <td>₹ {emp.salary}</td>
                <td>
                  <button
                    style={styles.delete}
                    onClick={() => deleteEmployee(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No employees added
                </td>
              </tr>
            )}
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
  delete: {
    padding: "6px 10px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default Employees;
