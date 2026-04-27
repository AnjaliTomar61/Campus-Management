import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

export default function FacultyForm({ embedded = false }) {
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const loadDepartments = useCallback(async () => {
    setDepartmentsLoading(true);
    try {
      const res = await api.get("/api/department/all");
      const list = (res.data?.departments || []).filter((d) => d.isActive !== false);
      setDepartments(list);
    } catch {
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const [formData, setFormData] = useState({
    name: "",
    officialEmail: "",
    department: "",
    role: "Lecturer",
    mobile: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const { name, officialEmail, department, password } = formData;

    if (!name || !officialEmail || !department) {
      return "Name, official email, and department are required";
    }

    if (!/\S+@\S+\.\S+/.test(officialEmail)) {
      return "Invalid email format";
    }

    if (password.trim().length > 0 && password.trim().length < 6) {
      return "Password must be at least 6 characters, or leave it blank to use the system default";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      officialEmail: formData.officialEmail.trim(),
      department: formData.department,
      role: formData.role,
      mobile: formData.mobile.trim(),
      ...(formData.password.trim() ? { password: formData.password } : {}),
    };

    try {
      const { data } = await api.post("/api/faculty/create", payload, {
        meta: { successMessage: "Faculty created successfully." },
      });

      const portal = data?.portal;
      const emp = portal?.employeeId;
      let loginHint = "";
      if (portal?.email) {
        loginHint = `Sign in with ${portal.email} on the main Sign in page.`;
        if (emp) loginHint = `Employee ID: ${emp}. ${loginHint}`;
        if (portal.defaultPassword) {
          loginHint += ` Default password: "${portal.defaultPassword}" (ask them to change it after first login).`;
        } else if (portal.passwordSetByAdmin) {
          loginHint += " They should use the password you set.";
        }
      }
      setSuccess(loginHint || data?.message || "Faculty created successfully.");
      setError("");

      setFormData({
        name: "",
        officialEmail: "",
        department: "",
        role: "Lecturer",
        mobile: "",
        password: "",
      });
    } catch (err) {
      setError(err?.message || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div
      className={
        embedded
          ? "flex justify-center p-4 sm:p-6 md:p-8"
          : cx("flex min-h-[50vh] items-center justify-center p-4 sm:p-6", ui.page)
      }
    >
      <form
        onSubmit={handleSubmit}
        className={cx(ui.card, "w-full max-w-xl p-6 sm:p-8")}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            {embedded ? "Add faculty member" : "Faculty registration"}
          </h2>
          <p className="mt-1 text-center text-sm text-slate-500">
            Employee ID is generated automatically. Set portal password and mobile here, or leave password blank for the
            default.
          </p>
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-sm leading-relaxed">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full name *"
          value={formData.name}
          onChange={handleChange}
          className={cx(ui.input, "mb-4")}
          autoComplete="name"
        />

        <input
          type="email"
          name="officialEmail"
          placeholder="Official email (login) *"
          value={formData.officialEmail}
          onChange={handleChange}
          className={cx(ui.input, "mb-4")}
          autoComplete="email"
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile number (optional)"
          value={formData.mobile}
          onChange={handleChange}
          className={cx(ui.input, "mb-4")}
          autoComplete="tel"
        />

        <input
          type="password"
          name="password"
          placeholder="Portal password (optional, min 6 chars; blank = default)"
          value={formData.password}
          onChange={handleChange}
          className={cx(ui.input, "mb-4")}
          autoComplete="new-password"
        />

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={ui.select}
            required
            disabled={departmentsLoading || departments.length === 0}
          >
            <option value="">
              {departmentsLoading ? "Loading departments…" : departments.length === 0 ? "No departments — add under Programs" : "Select department"}
            </option>
            {departments.map((d) => (
              <option key={d._id} value={d.name}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
          {!departmentsLoading && departments.length === 0 ? (
            <p className="mt-1.5 text-xs text-amber-800">
              Create departments in <strong>Admin → Programs</strong> so they appear here.
            </p>
          ) : null}
        </div>

        <select name="role" value={formData.role} onChange={handleChange} className={cx(ui.select, "mb-6")}>
          <option value="Lecturer">Lecturer</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Professor">Professor</option>
          <option value="HOD">HOD</option>
        </select>

        <button
          type="submit"
          disabled={departmentsLoading || departments.length === 0}
          className={cx(ui.btnBase, ui.btnPrimary, "w-full")}
        >
          Create faculty
        </button>
      </form>
    </div>
  );
}
