import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./LoginPage2.css";

export default function LoginPage2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add/remove class to body when component mounts/unmounts
  useEffect(() => {
    document.body.classList.add('login-modal-open');
    
    return () => {
      document.body.classList.remove('login-modal-open');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { success, role, error: loginError } = await login(email, password);
      
      if (!success) {
        setError(loginError || "Email ou mot de passe incorrect.");
        setIsLoading(false);
        return;
      }

      // Redirect based on user role
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login2-wrapper">
      <div className="login2-container">
        <div className="login2-left">
          <div className="login2-content">
            <h2 className="logo">🌱 SmartFalleh</h2>
            <h1 className="title">Connexion</h1>

            <form className="login2-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p className="error-message">{error}</p>}

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>

              <p className="forgot-password">
                Mot de passe oublié ? <a href="/forgot-password">Réinitialiser</a>
              </p>
            </form>
          </div>
        </div>
        
        <div className="login2-right">
          <div className="image-frame"></div>
        </div>
      </div>
    </div>
  );
}
