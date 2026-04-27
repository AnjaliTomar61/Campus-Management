// import { Sidebar } from 'lucide-react'
import React from 'react'
import Sidebar from './AdminSidebar'
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";


function AdminDashboard() {
  return (
    <>
     <div className="flex h-screen bg-amber-200 w-full">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
    </>
  )
}

export default AdminDashboard