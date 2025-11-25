import { Outlet, useLocation } from 'react-router-dom';
import SideBar from '../sidebar/SideBar';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import './dashboard.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Toggle body scroll when sidebar is open/closed
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    return (
        <div className="dashboard-layout">
            {/* Fixed Navbar */}
            <AdminNavbar />
            {/* Mobile menu button */}
            <button
                type="button"
                className="mobile-menu-button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
                id="menu-button"
            >
                {isSidebarOpen ? (
                    <FiX className="menu-icon" />
                ) : (
                    <FiMenu className="menu-icon" />
                )}
            </button>

            {/* Overlay for mobile */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div 
                className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}
                id="sidebar-wrapper"
            >
                <SideBar onClose={() => setIsSidebarOpen(false)} />
            </div>
             
            {/* Main content */}
            <div className="main-content">
                <div className="page-content-inner">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;