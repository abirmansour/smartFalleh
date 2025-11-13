import React from 'react';
import './Footer.css'; // On importe le CSS

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <p className="footer-text">© 2025 SmartFalleh. Tous droits réservés.</p>
        <p className="footer-text">Email: support@smartfalleh.com</p>
      </div>
    </footer>
  );
};

export default Footer;
