import React from "react";
import "./DashborddAdmin.css";
import AnimatedHeader from "./AnimatedHeader"; // 👈 component جديد

export default function DashboardAdmin() {
  return (
    <div className="dashboard-container">
      {/* 🔥 أنماسيون الفوق */}
      <AnimatedHeader />

      <h2>Bienvenue sur le Dashboard Admin</h2>
      <p>Cette page est un aperçu rapide de votre application.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Agriculteurs</h3>
          <p>Nombre total: 24</p>
        </div>
        <div className="dashboard-card">
          <h3>Demandes</h3>
          <p>En attente: 5</p>
        </div>
        <div className="dashboard-card">
          <h3>Rapports</h3>
          <p>Derniers rapports: 3</p>
        </div>
      </div>
    </div>
  );
}
