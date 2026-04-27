import { useState } from "react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

export default function FacultyForm() {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    officialEmail: "",
    department: "",
    role: "Lecturer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate required fields
  const validate = () => {
    const { employeeId, name, officialEmail, department } = formData;

    if (!employeeId || !name || !officialEmail || !department) {
      return "All required fields must be filled";
    }

    // simple email validation
    if (!/\S+@\S+\.\S+/.test(officialEmail)) {
      return "Invalid email format";
    }

    return "";
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      await api.post("/api/faculty/create", formData, {
        meta: { successMessage: "Faculty created successfully." },
      });

      setSuccess("Faculty created successfully.");
      setError("");

      // reset form
      setFormData({
        employeeId: "",
        name: "",
        officialEmail: "",
        department: "",
        role: "Lecturer",
      });
    } catch (err) {
      setError(err?.message || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className={cx("flex items-center justify-center p-4 sm:p-6", ui.page)}>
      <form
        onSubmit={handleSubmit}
        className={cx(ui.card, "w-full max-w-xl p-6 sm:p-8")}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Faculty Registration
          </h2>
          <p className="mt-1 text-center text-sm text-slate-500">
            Create a faculty profile and assign a department & role.
          </p>
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        {/* Employee ID */}
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID *"
          value={formData.employeeId}
          onChange={handleChange}
          className={cx(ui.input, "mb-4")}
/>
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          className={cx(ui.input, "mb-4")}
        />

        {/* Email */}
        <input
          type="email"
          name="officialEmail"
          placeholder="Official Email *"
          value={formData.officialEmail}
          onChange={handleChange}
          className={cx(ui.input, "mb-4")}
        />

        {/* Department */}
        <select
  name="department"
  value={formData.department}
  onChange={handleChange}
  className={cx(ui.select, "mb-4")}
  required
>
  <option value="">Select Department *</option>
  <option value="Computer Application">Computer Application</option>
  <option value="Computer Science">Computer Science</option>
  <option value="BSc">BSc</option>
  <option value="MSc">MSc</option>
  <option value="Law">Law</option>
  <option value="BBA">BBA</option>
  <option value="MBA">MBA</option>
</select>

        {/* Role */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={cx(ui.select, "mb-6")}
        >
          <option value="Lecturer">Lecturer</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Professor">Professor</option>
          <option value="HOD">HOD</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className={cx(ui.btnBase, ui.btnPrimary, "w-full")}
        >
          Create Faculty
        </button>
      </form>
    </div>
  );
}