import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { token, id, role, email: userEmail } = response.data;

      if (!token || !id) {
        setError("Connexion échouée : données manquantes.");
        setIsLoading(false);
        return;
      }

      // حفظ البيانات في localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      localStorage.setItem("email", userEmail);

      // توجيه حسب الدور
      switch (role) {
  case "admin":
    navigate("/admin/dashboard");
    
}

    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="login-input"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="login-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button
          type="submit"
          className={`login-button ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
