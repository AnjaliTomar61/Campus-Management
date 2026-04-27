import { useEffect, useState } from "react";
import axios from "axios";

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const API = "http://localhost:3000/api/department";

  // 📄 Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      setDepartments(res.data.departments);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✏️ Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔄 Toggle
  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API}/toggle/${id}`);
      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  // ➕ Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData);
      } else {
        await axios.post(`${API}/create`, formData);
      }

      setShowForm(false);
      setEditId(null);
      setFormData({
        name: "",
        code: "",
        description: "",
      });

      fetchDepartments();
    } catch (err) {
      console.log(err);
    }
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this department?")) {
      await axios.delete(`${API}/${id}`);
      fetchDepartments();
    }
  };

  // ✏️ Edit
  const handleEdit = (dept) => {
    setShowForm(true);
    setEditId(dept._id);

    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || "",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departments</h1>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Department
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6 grid grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Department Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="code"
            placeholder="Department Code"
            value={formData.code}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button className="col-span-2 bg-green-500 text-white py-2 rounded">
            {editId ? "Update Department" : "Create Department"}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th> {/* ✅ FIXED POSITION */}
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((d) => (
              <tr key={d._id} className="border-t">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.code}</td>
                <td className="p-3">{d.description || "-"}</td>

                {/* ✅ STATUS COLUMN (correct position) */}
                <td className="p-3">
                  {d.isActive ? (
                    <span className="text-green-600 font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Inactive
                    </span>
                  )}
                </td>

                {/* ✅ ACTIONS */}
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleToggle(d._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    {d.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}