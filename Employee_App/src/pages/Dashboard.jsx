import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Employee from '../components/Employee'; // Keep Employee component for admin dashboard

function Dashboard({ role }) {
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const navigate = useNavigate();

  const handleSalaryNavigation = () => {
    if (employeeIdInput) {
      navigate(`/salary/${employeeIdInput}`);
    }
  };

  return (
    <div>
      <h1>Dashboard ({role})</h1>

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {role === "admin" && <li><Link to="/employees">Employee Management</Link></li>}
          <li><Link to="/attendance">Attendance Tracking</Link></li>
          <li>
            <span>View Salary: </span>
            <input
              type="number"
              placeholder="Employee ID"
              value={employeeIdInput}
              onChange={(e) => setEmployeeIdInput(e.target.value)}
            />
            <button onClick={handleSalaryNavigation}>Go</button>
          </li>
        </ul>
      </nav>

      {/* Optionally, display some summary or quick info on the dashboard */}
      {role === "admin" && <Employee />}
      {/* Attendance and Salary components are now accessed via their routes */}
    </div>
  );
}

export default Dashboard;
