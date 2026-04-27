// import { Sidebar } from 'lucide-react'
import React from 'react'
import { Outlet } from "react-router-dom";
import FacultyHeader from './FacultyHeader';
import FacultySidebar from './FacultySidebar';


function FacultyDashboard() {
  return (
    <>
     <div className="flex h-screen bg-amber-200 w-full">
      
      {/* Sidebar */}
      <FacultySidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <FacultyHeader/>

        {/* Page Content */}
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
    </>
  )
}

export default FacultyDashboard;