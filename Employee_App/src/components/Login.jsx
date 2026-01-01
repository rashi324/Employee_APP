import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      onLogin(data.role); // Still set the role in the parent App component
      navigate("/"); // Redirect to dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Username"
        onChange={e => setUsername(e.target.value)} />

      <input type="password" placeholder="Password"
        onChange={e => setPassword(e.target.value)} />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
