import React from "react";

const AdminProfile = () => {
  const admin = {
    name: "Anjali Tomar",
    email: "anjali@gmail.com",
    designation: "Admin",
    dob: "14 Jan 2002",
    joiningDate: "01 Jan 2024",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        
        <h2 className="text-2xl font-bold mb-6 text-slate-700">
          Admin Profile
        </h2>

        <div className="space-y-4">
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Designation:</strong> {admin.designation}</p>
          <p><strong>Date of Birth:</strong> {admin.dob}</p>
          <p><strong>Joining Date:</strong> {admin.joiningDate}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;