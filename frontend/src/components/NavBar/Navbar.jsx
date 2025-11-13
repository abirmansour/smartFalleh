import { Link as ScrollLink } from 'react-scroll';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Modal from "../Modal/Modal";
import Login from '../Connextion/LoginPage2';
import Demande from '../demande/Demande'; // ✅ استيراد الفورم
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemandeModalOpen, setIsDemandeModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    if (token && role && email) {
      setUser({ token, role, email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const handleSuccessfulLogin = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    if (token && role && email) {
      setUser({ token, role, email });
      setIsLoginModalOpen(false);
      navigate("/profile");
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">Logo</NavLink>

        <div className="navbar-desktop">
          <nav className="navbar-links">
            {['home', 'about', 'contact'].map(section => (
              <ScrollLink
                key={section}
                to={section}
                smooth={true}
                spy={true}
                duration={500}
                offset={-100}
                className="navbar-link"
                activeClass="active-link"
              >
                {section === 'home' ? 'Accueil' : section === 'about' ? 'À propos' : 'Contact'}
              </ScrollLink>
            ))}
          </nav>

          
            
            <div className="navbar-auth-buttons">
              <button 
                onClick={() => setIsDemandeModalOpen(true)} 
                className="btn-demande"
              >
                Demande
              </button>
              <button 
                onClick={() => navigate("/login2")} 
                className="btn-login"
              >
                Se connecter
              </button>
            </div>
          
        </div>
      </div>

      {/* ✅ Modal de Connexion */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Connexion">
        <Login onClose={handleSuccessfulLogin} />
      </Modal>

      {/* ✅ Modal de Demande */}
      <Modal isOpen={isDemandeModalOpen} onClose={() => setIsDemandeModalOpen(false)} title="Inscription">
  <Demande onClose={() => setIsDemandeModalOpen(false)} />
</Modal>

    </div>
  );
}
