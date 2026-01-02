import { useEffect, useState } from "react";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  return (
    <div>
      <h2>Employees</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp._id}>
            {emp.name} - {emp.role} - ₹{emp.basicSalary}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Employees;
