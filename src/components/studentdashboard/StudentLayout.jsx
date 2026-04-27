import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentHeader from "./StudentHeader";
import StudentSidebar from "./StudentSidebar";
import { ui } from "../../lib/ui";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={ui.dashShell}>
      <StudentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={ui.dashMainColumn}>
        <StudentHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <div className={ui.dashContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;
