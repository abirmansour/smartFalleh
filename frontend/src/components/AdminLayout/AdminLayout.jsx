import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../SideBarAdmin/SidebarAdmin";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./Admin-layout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <div className="admin-main">
        <AdminNavbar />
        <main className="admin-content">
          <div className="admin-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
