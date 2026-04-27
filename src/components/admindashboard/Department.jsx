import { useEffect, useState } from "react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  // 📄 Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get(`/api/department/all`);
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
      await api.patch(`/api/department/toggle/${id}`, null, {
        meta: { successMessage: "Department status updated." },
      });
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
        await api.put(`/api/department/${editId}`, formData, {
          meta: { successMessage: "Department updated successfully." },
        });
      } else {
        await api.post(`/api/department/create`, formData, {
          meta: { successMessage: "Department created successfully." },
        });
      }

      closeForm();
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

  const openCreate = () => {
    setShowForm(true);
    setEditId(null);
    setFormData({ name: "", code: "", description: "" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this department?")) {
      try {
        await api.delete(`/api/department/${id}`, {
          meta: { successMessage: "Department deleted." },
        });
      } catch (e) {
        // toast already handled globally
        console.log(e);
      }
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
    <div className={cx("p-4 sm:p-6", ui.page)}>
      {/* Header */}
      <div className={cx(ui.cardHeader, "mb-6")}>
        <div>
          <h1 className={ui.h1}>Departments</h1>
          <p className="text-sm text-slate-500">
            Create, update, enable/disable and manage departments.
          </p>
        </div>

        <button
          onClick={openCreate}
          className={cx(ui.btnBase, ui.btnAccent)}
        >
          + Add Department
        </button>
      </div>

      {/* Form Modal */}
      <Modal
        open={showForm}
        title={editId ? "Update Department" : "Create Department"}
        onClose={closeForm}
        maxWidthClassName="max-w-xl"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeForm}
              className={cx(ui.btnBase, ui.btnSoft)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="departmentForm"
              className={cx(ui.btnBase, ui.btnPrimary)}
            >
              {editId ? "Save Changes" : "Create Department"}
            </button>
          </div>
        }
      >
        <form
          id="departmentForm"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Department Name
              </label>
              <input
                name="name"
                placeholder="e.g. Computer Science"
                value={formData.name}
                onChange={handleChange}
                className={ui.input}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Code
              </label>
              <input
                name="code"
                placeholder="e.g. CSE"
                value={formData.code}
                onChange={handleChange}
                className={ui.input}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description (optional)
            </label>
            <input
              name="description"
              placeholder="Short description about this department"
              value={formData.description}
              onChange={handleChange}
              className={ui.input}
            />
          </div>
        </form>
      </Modal>

      {/* Table */}
      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[860px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Name</th>
                <th className={ui.dashTableTh}>Code</th>
                <th className={ui.dashTableTh}>Description</th>
                <th className={ui.dashTableTh}>Status</th>
                <th className={ui.dashTableTh}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((d) => (
                <tr key={d._id} className={ui.dashTableRow}>
                  <td className={ui.dashTableTd}>{d.name}</td>
                  <td className={ui.dashTableTd}>{d.code}</td>
                  <td className={ui.dashTableTd}>{d.description || "-"}</td>
                  <td className={ui.dashTableTd}>
                    {d.isActive ? (
                      <span className="font-semibold text-green-600">Active</span>
                    ) : (
                      <span className="font-semibold text-red-500">Inactive</span>
                    )}
                  </td>
                  <td className={ui.dashTableTd}>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(d)}
                        className={cx(ui.btnBase, ui.btnSoft, "px-3 py-1.5")}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(d._id)}
                        className={cx(ui.btnBase, ui.btnDanger, "px-3 py-1.5")}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(d._id)}
                        className={cx(ui.btnBase, ui.btnPrimary, "px-3 py-1.5")}
                      >
                        {d.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}