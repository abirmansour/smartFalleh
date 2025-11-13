import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronRight, FiLogOut, FiGrid, FiSettings, FiFileText } from "react-icons/fi";
import "./SidebarAdminPage.css";

const MenuItem = ({ item, isChild = false, isOpen = false, onToggle, onLogout }) => {
  const navigate = useNavigate();
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = (e) => {
    if (item.path === "/logout") {
      e.preventDefault();
      onLogout && onLogout();
    } else if (hasChildren) {
      e.preventDefault();
      onToggle && onToggle();
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className={isChild ? "menu-child" : ""}>
      <NavLink
        to={item.path === "/logout" ? "#" : item.path}
        className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
        onClick={handleClick}
      >
        <span className="menu-icon">{item.icon}</span>
        <span className="menu-title">{item.title}</span>
        {hasChildren && (
          <span className="menu-chevron">
            {isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </span>
        )}
      </NavLink>
      {hasChildren && isOpen && (
        <div className="menu-children">
          {item.children.map((child, idx) => (
            <MenuItem key={idx} item={child} isChild onLogout={onLogout} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function SidebarAdmin({ onLogout }) {
  const [openItems, setOpenItems] = useState({});
  const navigate = useNavigate();

  const adminMenu = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
    {
      title: "Administration",
      path: "/admin/administration",
      icon: <FiSettings />,
      children: [
        { title: "Agriculteur", path: "/admin/administration/agriculteur" },
        { title: "Jury", path: "/admin/administration/jury" },
        { title: "Responsable", path: "/admin/administration/responsable" },
        { title: "Demande", path: "/admin/administration/demande" },
        { title: "Product", path: "/admin/administration/product" },
        { title: "Cooperative", path: "/admin/administration/cooperative" },
      ],
    },
    { title: "Profile", path: "/admin/profile", icon: <FiFileText /> },
  ];

  const toggleItem = (path) => setOpenItems((prev) => ({ ...prev, [path]: !prev[path] }));

  const handleLogout = () => {
  localStorage.clear();
  navigate("/login2"); 
};


  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>SmartFalleh</h1>
        <p>Connecté en tant que Admin</p>
      </div>

      <nav className="sidebar-nav">
        {adminMenu.map((item, idx) => (
          <MenuItem
            key={idx}
            item={item}
            isOpen={openItems[item.path]}
            onToggle={() => toggleItem(item.path)}
            onLogout={handleLogout}
          />
        ))}
      </nav>

      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
