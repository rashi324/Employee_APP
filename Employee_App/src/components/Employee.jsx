import { useEffect, useState } from "react";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");

  const loadEmployees = async () => {
    const res = await fetch("http://localhost:5000/employees");
    const data = await res.json();
    setEmployees(data);
  };

  const addEmployee = async () => {
    await fetch("http://localhost:5000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, salary })
    });
    loadEmployees();
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div>
      <h2>Employees</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Role" onChange={e => setRole(e.target.value)} />
      <input placeholder="Salary" onChange={e => setSalary(e.target.value)} />

      <button onClick={addEmployee}>Add</button>

      <ul>
        {employees.map(e => (
          <li key={e[0]}>
            {e[1]} - {e[2]} - ₹{e[3]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Employee;
