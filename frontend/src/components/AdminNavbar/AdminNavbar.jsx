import { FiSearch, FiBell } from "react-icons/fi";
import "./AdminNavbar.css";

export default function AdminNavbar() {

  return (
    <div className="admin-navbar-container">
      <div className="admin-navbar-inner">
        <h1 className="admin-navbar-title">Admin Dashboard</h1>
        <div className="admin-navbar-right">
          <div className="admin-navbar-search-box">
            <FiSearch size={18} className="admin-navbar-search-icon" />
            <input type="text" placeholder="Rechercher..." />
          </div>
          <div className="admin-navbar-notification-icon">
            <FiBell size={20} />
            <span className="admin-navbar-notif-badge">3</span>
          </div>
          <span className="admin-navbar-user">Bonjour, Admin</span>
        </div>
      </div>
    </div>
  );
}
