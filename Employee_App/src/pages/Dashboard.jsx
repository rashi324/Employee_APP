import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">EMS</h2>

        <nav>
          <button onClick={() => navigate("/employees")}> Employees</button>
          <button onClick={() => navigate("/attendance")}> Attendance</button>
          <button onClick={() => navigate("/salary")}> Salary</button>
          <button onClick={() => navigate("/leave")}> Leave</button>
          <button onClick={() => navigate("/reports")}> Reports</button>
        </nav>

        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1>Employee Attendance & Salary Management</h1>

        <div className="cards">
          <div className="card">
            <h3>Total Employees</h3>
            <p>24</p>
          </div>

          <div className="card">
            <h3>Present Today</h3>
            <p>19</p>
          </div>

          <div className="card">
            <h3>On Leave</h3>
            <p>3</p>
          </div>

          <div className="card">
            <h3>Pending Leaves</h3>
            <p>2</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
