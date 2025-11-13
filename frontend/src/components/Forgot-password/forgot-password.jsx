import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Forgot-Password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/users/request-password-reset", { email });

      Swal.fire({
        icon: "success",
        title: "Email envoyé",
        text: "Veuillez vérifier votre boîte mail pour réinitialiser votre mot de passe.",
        confirmButtonColor: "#007f3f",
      });

      setEmail("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue. Veuillez réessayer.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2 className="logo">🌱 SmartFalleh</h2>
        <h1 className="title">Mot de passe oublié</h1>
        <p className="subtitle">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Envoyer le lien</button>
        </form>

        <div className="forgot-link">
          <a href="/login2">← Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
