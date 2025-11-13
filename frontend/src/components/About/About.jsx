import React from "react";
import "./AboutPage.css";

export default function About() {
  return (
    <div id="about" className="about-section">
      <div className="about-container">
        <h2 className="about-title">À Propos de Nous</h2>
        <div className="about-grid">
          <div className="about-text">
            <h3 className="about-subtitle">Notre Mission</h3>
            <p className="about-paragraph">
              Nous nous engageons à fournir des solutions innovantes et de qualité pour répondre aux besoins de nos clients.
              Notre équipe dévouée travaille sans relâche pour vous offrir la meilleure expérience possible.
            </p>

            <h3 className="about-subtitle">Notre Vision</h3>
            <p className="about-paragraph">
              Devenir le leader dans notre domaine en offrant des services exceptionnels et en repoussant constamment
              les limites de l'innovation technologique.
            </p>
          </div>

          <div className="about-values-card">
            <h3 className="about-values-title">Nos Valeurs</h3>
            <ul className="about-values-list">
              <li className="about-value-item">
                <span className="about-value-check">✓</span>
                <span className="about-value-text">Innovation continue</span>
              </li>
              <li className="about-value-item">
                <span className="about-value-check">✓</span>
                <span className="about-value-text">Satisfaction client</span>
              </li>
              <li className="about-value-item">
                <span className="about-value-check">✓</span>
                <span className="about-value-text">Intégrité et transparence</span>
              </li>
              <li className="about-value-item">
                <span className="about-value-check">✓</span>
                <span className="about-value-text">Excellence opérationnelle</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
