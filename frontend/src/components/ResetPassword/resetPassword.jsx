import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Erreur", "Les mots de passe ne correspondent pas.", "error");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users/reset-password", {
        token,
        newPassword,
      });

      Swal.fire("Succès", "Mot de passe réinitialisé avec succès.", "success");
      setTimeout(() => navigate("/login2"), 2000);
    } catch (err) {
      Swal.fire(
        "Erreur",
        err.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer.",
        "error"
      );
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-card">
        <div className="reset-content">
          <h2 className="logo">🌱 SmartFalleh</h2>
          <h1 className="title">Réinitialiser le mot de passe</h1>
          <p className="subtitle">
            Entrez votre nouveau mot de passe ci-dessous.
          </p>

          <form onSubmit={handleSubmit} className="reset-form">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Réinitialiser</button>
          </form>

          <div className="reset-link">
            <a href="/login2">← Retour à la connexion</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
