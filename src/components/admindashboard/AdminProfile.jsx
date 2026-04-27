import React from "react";
import { cx, ui } from "../../lib/ui";

const AdminProfile = () => {
  const admin = {
    name: "Anjali Tomar",
    email: "anjali@gmail.com",
    designation: "Admin",
    dob: "14 Jan 2002",
    joiningDate: "01 Jan 2024",
  };

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className={cx("mx-auto max-w-3xl p-6 sm:p-8", ui.card)}>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Profile</h2>
            <p className="text-sm text-slate-500">
              Personal details & account information.
            </p>
          </div>
          <div className="h-14 w-14 rounded-2xl brand-card grid place-items-center text-white text-xl font-bold">
            A
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" value={admin.name} />
          <Field label="Email" value={admin.email} />
          <Field label="Designation" value={admin.designation} />
          <Field label="Date of Birth" value={admin.dob} />
          <Field label="Joining Date" value={admin.joiningDate} />
        </div>

      </div>
    </div>
  );
};

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}

export default AdminProfile;