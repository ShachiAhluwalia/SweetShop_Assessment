import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://127.0.0.1:8000/auth/register"
      : "http://127.0.0.1:8000/auth/login";

    const body = isRegister
      ? JSON.stringify({ email, password })
      : new URLSearchParams({
          username: email.trim(),
          password,
        });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": isRegister
            ? "application/json"
            : "application/x-www-form-urlencoded",
        },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Something went wrong");
        return;
      }

      // Registration success
      if (isRegister) {
        alert("Registration successful! Please login.");
        setIsRegister(false);
        return;
      }

      // Login success
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_role", data.role || "user");

      window.location.href = "/sweets";
    } catch {
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fff0f6, #ffe4ec)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          width: "320px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {isRegister ? "Register" : "Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "16px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#ec407a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "12px" }}>
          {isRegister ? "Already have an account?" : "New user?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{
              color: "#ec407a",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isRegister ? "Login here" : "Register here"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
