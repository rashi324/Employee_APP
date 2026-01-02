import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
<Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
<Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
<Route path="/leave" element={<ProtectedRoute><Leave /></ProtectedRoute>} />
<Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
