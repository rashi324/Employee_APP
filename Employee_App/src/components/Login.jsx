import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
      onLogin(data.role);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login}>
          Login
        </button>

        <p style={styles.text}>
          Don't have an account? <Link style={styles.link} to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #1f1c2c, #928dab)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#2c2c2c",
    padding: "40px 50px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    width: "350px",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    marginBottom: "30px",
    fontSize: "28px",
  },
  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#3b3b3b",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "8px",
    border: "none",
    fontSize: "18px",
    backgroundColor: "#6c63ff",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  text: {
    marginTop: "20px",
    color: "#bbb",
    fontSize: "14px",
  },
  link: {
    color: "#6c63ff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
