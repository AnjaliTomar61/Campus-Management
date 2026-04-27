import { useState } from "react";
import { Outlet } from "react-router-dom";
import FacultyHeader from "./FacultyHeader";
import FacultySidebar from "./FacultySidebar";
import { ui } from "../../lib/ui";

function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={ui.dashShell}>
      <FacultySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={ui.dashMainColumn}>
        <FacultyHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <div className={ui.dashContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
