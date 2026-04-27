import { useNavigate } from "react-router-dom";
import { cx, ui } from "../lib/ui";

export default function AdmissionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className={cx(ui.card, "mx-auto max-w-4xl p-6 sm:p-8")}>
        <h1 className="text-3xl font-bold text-slate-900">Admission</h1>
        <p className="mt-2 text-slate-600">
          Start your admission journey. You can create an account first, then submit
          your admission application inside the student dashboard.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className={cx(ui.btnBase, ui.btnPrimary)} onClick={() => navigate("/signup")}>
            Create account
          </button>
          <button className={cx(ui.btnBase, ui.btnSoft)} onClick={() => navigate("/login?role=student")}>
            Student login
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Admission flow</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
            <li>Register account (Student role)</li>
            <li>Complete profile + upload documents</li>
            <li>Submit admission application</li>
            <li>Admin reviews and approves/rejects</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

