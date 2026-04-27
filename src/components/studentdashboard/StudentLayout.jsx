import React from 'react'
import { Outlet } from "react-router-dom";
import StudentHeader from './StudentHeader';
import StudentSidebar from './StudentSidebar';

function StudentLayout() {
  return (
    <>
    <div className="flex h-screen bg-amber-200 w-full">
      
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <StudentHeader/>

        {/* Page Content */}
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
    </>
   
  )
}

export default StudentLayout
