import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "./ContactPage.css";

export default function Contact() {
  return (
    <div id="contact" className="contact-section">
      {/* Header */}
      <div className="contact-header">
        <h1>Nous contacter</h1>
        <p>Une question, une demande ? Notre équipe est à votre écoute.</p>
      </div>

      {/* Infos de contact */}
      <div className="contact-cards">
        {/* Email */}
        <div className="contact-card">
          <div className="contact-icon"><FaEnvelope /></div>
          <h3>Email</h3>
          <p>contact@smartfalleh.com</p>
          <p>support@smartfalleh.com</p>
        </div>

        {/* Téléphone */}
        <div className="contact-card">
          <div className="contact-icon"><FaPhone /></div>
          <h3>Téléphone</h3>
          <p>+216 71 580 334</p>
          <p>Service client: 9h-18h</p>
        </div>

        {/* Adresse */}
        <div className="contact-card">
          <div className="contact-icon"><FaMapMarkerAlt /></div>
          <h3>Adresse</h3>
          <p>5 Rue Abderrahmen Ibn Zied</p>
          <p>2042 Tunis, Tunisie</p>
        </div>

        {/* Horaires */}
        <div className="contact-card">
          <div className="contact-icon"><FaClock /></div>
          <h3>Horaires</h3>
          <p>Lundi-Vendredi: 9h-18h</p>
          <p>Samedi: 10h-14h</p>
        </div>
      </div>

      {/* Équipe */}
      <div className="contact-team">
        <h2>Notre équipe</h2>
        <div className="team-grid">
          {/* Membre 1 */}
          <div className="team-member">
            <div className="team-photo">
              <img src="/src/assets/profile_picture.jpg" alt="Abir Mansour" />
            </div>
            <h4>Abir Mansour</h4>
            <p>Directeur commercial</p>
            <p>abir@smartfalleh.com</p>
          </div>

          {/* Membre 2 */}
          <div className="team-member">
            <div className="team-photo">
              <img src="/src/assets/profile_picture.jpg" alt="Nawress El Abed" />
            </div>
            <h4>Nawress El Abed</h4>
            <p>Responsable clientèle</p>
            <p>nawress@smartfalleh.com</p>
          </div>

          {/* Membre 3 */}
          <div className="team-member">
            <div className="team-photo">
              <img src="/src/assets/profile_picture.jpg" alt="Hiba Bouslahi" />
            </div>
            <h4>Hiba Bouslahi</h4>
            <p>Support technique</p>
            <p>hiba@smartfalleh.com</p>
          </div>

          {/* Membre 4 */}
          <div className="team-member">
            <div className="team-photo">
              <img src="/src/assets/profile_picture.jpg" alt="Sarra Charfi" />
            </div>
            <h4>Sarra Charfi</h4>
            <p>Ressources Humaines</p>
            <p>sarra@smartfalleh.com</p>
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className="contact-map">
        <h2>Nous trouver</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.847517468861!2d10.1555418!3d36.8499143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd33003988e799%3A0xf7e4c8e643cb3c01!2s5%2C%20Rue%20Abderrahmen%20ibn%20ziad%20cit%C3%A9%20Ettahrir!5e0!3m2!1sen!2stn!4v1712345678901!5m2!1sen!2stn"
            width="100%"
            height="120%"
            className="map-frame"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - Notre localisation"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
