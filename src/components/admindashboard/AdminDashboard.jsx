import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { ui } from "../../lib/ui";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={ui.dashShell}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={ui.dashMainColumn}>
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <div className={ui.dashContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
