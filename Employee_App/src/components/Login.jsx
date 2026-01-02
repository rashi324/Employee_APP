import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ LOGIN FUNCTION (MERGED CORRECTLY)
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("token", data.token);

      alert("Login successful");
      navigate("/dashboard"); // ✅ GO TO DASHBOARD
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">
          Ready to continue your learning journey?
          <br />
          Your path is right here.
        </p>

        <input
          className="input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-box">
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye"></span>
        </div>

        <div className="options">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <span className="forgot">Forgot password?</span>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Log In
        </button>

        <div className="divider">
          <span>Sign in with</span>
        </div>

        <div className="social">
          <button className="social-btn fb">f</button>
          <button className="social-btn g">G</button>
          <button className="social-btn apple"></button>
        </div>

        <p className="signup">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
