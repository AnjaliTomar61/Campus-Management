import { useState } from "react";
import axios from "axios";

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
      const res = await axios.post(
        "http://localhost:3000/api/faculty/create",
        formData
      );

      setSuccess("Faculty created successfully");
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
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Faculty Registration (Admin)
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        {/* Employee ID */}
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID *"
          value={formData.employeeId}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(46,71,125)]"
/>
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        {/* Email */}
        <input
          type="email"
          name="officialEmail"
          placeholder="Official Email *"
          value={formData.officialEmail}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        {/* Department */}
        <select
  name="department"
  value={formData.department}
  onChange={handleChange}
  className="w-full mb-4 p-3 border rounded-lg"
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
          className="w-full mb-4 p-3 border rounded-lg"
        >
          <option value="Lecturer">Lecturer</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Professor">Professor</option>
          <option value="HOD">HOD</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#0F172A] text-white py-3 rounded-lg hover:bg-orange-400 transition"
        >
          Create Faculty
        </button>
      </form>
    </div>
  );
}