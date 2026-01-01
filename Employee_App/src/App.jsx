import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard"; // This will be created next
import Employee from "./components/Employee";
import Attendance from "./components/Attendance"; // This will be the new attendance page
import Salary from "./components/Salary";

function App() {
  const [role, setRole] = useState(null); // role will be 'admin' or 'employee'

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setRole} />} />
        <Route
          path="/"
          element={role ? <Dashboard role={role} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/employees"
          element={role === "admin" ? <Employee /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/attendance"
          element={role ? <Attendance /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/salary/:emp_id"
          element={role ? <Salary /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
