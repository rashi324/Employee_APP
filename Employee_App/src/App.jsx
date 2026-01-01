import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import Employee from "./components/Employee";
import Attendance from "./components/Attendance";
import Salary from "./components/Salary";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  const [role, setRole] = useState(null); // role will be 'admin' or 'employee'

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setRole} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            role ? (
              <DashboardLayout role={role}>
                <Routes>
                  <Route path="/" element={<Dashboard role={role} />} />
                  <Route
                    path="/employees"
                    element={role === "admin" ? <Employee /> : <Navigate to="/" replace />}
                  />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/salary/:emp_id" element={<Salary />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
