import  { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getAllMenuItems} from '../config/menuItems'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './sidebar.css';
import PropTypes from 'prop-types';

const MenuItemType = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.arrayOf(PropTypes.object),
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

const SideBarProps = {
  onClose: PropTypes.func
};

const MenuItemProps = {
  item: PropTypes.shape(MenuItemType).isRequired,
  isChild: PropTypes.bool,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  onClose: PropTypes.func
};

const MenuItem = ({ item, isChild = false, isOpen = false, onToggle, onClose }) => {
  const hasChildren = item.children && item.children.length > 0;
  // NavLink will handle the active state
  
  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      if (onToggle) onToggle();
    } else if (onClose) {
      onClose();
    }
  };

  // Build the correct path - handle both dashboard and admin routes
const buildPath = (path) => {
  if (path === '') return '/dashboard';
  return `/dashboard/${path}`;
};

  return (
    <div className={`menu-item ${isChild ? 'submenu' : ''}`}>
      <NavLink
        to={buildPath(item.path)}
        end={!hasChildren}
        onClick={(e) => {
          handleClick(e);
          if (!hasChildren && onClose) {
            onClose();
          }
        }}
        className={({ isActive }) => 
          `menu-link ${isActive ? 'active' : ''}`
        }
      >
        <span className="menu-icon">{item.icon}</span>
        <span className="menu-text">{item.title}</span>
        {hasChildren && (
          <span className={`menu-arrow ${isOpen ? 'open' : ''}`}>
            {isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </span>
        )}
      </NavLink>
      
      {hasChildren && isOpen && item.children && (
        <div className="submenu-items">
          {item.children.map((child, index) => (
            <MenuItem 
              key={index} 
              item={child} 
              isChild 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SideBar = ({ onClose }) => {
  const { userRole, logout } = useAuth();
  const [openItems, setOpenItems] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const menuItems = getAllMenuItems(userRole);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [location.pathname, onClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (isOpen && sidebar && !sidebar.contains(event.target) && 
          menuButton && !menuButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  const toggleItem = (path) => {
    setOpenItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      // Clear any existing navigation state
      window.history.replaceState({}, document.title);
      // Force a full page reload to reset the application state
      window.location.href = '/';
    }
  };

  return (
    <aside
      id="sidebar"
      className="sidebar"
    >
        <div className="sidebar-header">
          <h1 className="sidebar-title">SmartFalleh</h1>
          <p className="sidebar-subtitle">
            {userRole ? `Connecté en tant que ${userRole}` : 'Non connecté'}
          </p>
        </div>
        
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <div key={index}>
              <MenuItem
                item={item}
                isOpen={openItems[item.path]}
                onToggle={() => toggleItem(item.path)}
                onClose={() => setIsOpen(false)}
              />
            </div>
          ))}
        </nav>

        {/* Logout button at the bottom */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <span className="logout-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <span>Déconnexion</span>
          </button>
        </div>
    </aside>
  );
};

export default SideBar;