import { useEffect, useState } from "react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

export default function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    department: "",
    duration: "",
    totalSemesters: "",
    fees: "",
    description: "",
  });

  // FETCH
  const fetchCourses = async () => {
    try {
      const res = await api.get(`/api/course/all`);
      setCourses(res.data.courses);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get(`/api/department/all`);
      setDepartments(res.data.departments);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  // INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/api/course/${editId}`, formData, {
          meta: { successMessage: "Course updated successfully." },
        });
      } else {
        await api.post(`/api/course/create`, formData, {
          meta: { successMessage: "Course created successfully." },
        });
      }

      setShowForm(false);
      setEditId(null);
      resetForm();
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  const resetForm = () => {
    setFormData({
      courseName: "",
      courseCode: "",
      department: "",
      duration: "",
      totalSemesters: "",
      fees: "",
      description: "",
    });
  };

  // EDIT
  const handleEdit = (course) => {
    setShowForm(true);
    setEditId(course._id);

    setFormData({
      courseName: course.courseName,
      courseCode: course.courseCode,
      department: course.department?._id || "",
      duration: course.duration,
      totalSemesters: course.totalSemesters,
      fees: course.fees,
      description: course.description || "",
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        await api.delete(`/api/course/${id}`, {
          meta: { successMessage: "Course deleted." },
        });
        fetchCourses();
      } catch (e) {
        console.log(e);
      }
    }
  };

  // TOGGLE
  const handleToggle = async (id) => {
    try {
      await api.patch(`/api/course/toggle/${id}`, null, {
        meta: { successMessage: "Course status updated." },
      });
      fetchCourses();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>

      {/* HEADER */}
      <div className={cx(ui.cardHeader, "mb-6")}>
        <div>
          <h1 className={ui.h1}>Courses</h1>
          <p className="text-sm text-slate-500">
            Manage courses, assign departments, and enable/disable visibility.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            resetForm();
          }}
          className={cx(ui.btnBase, ui.btnAccent)}
        >
          + Add Course
        </button>
      </div>

      {/* TABLE */}
      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[900px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Name</th>
                <th className={ui.dashTableTh}>Code</th>
                <th className={ui.dashTableTh}>Department</th>
                <th className={ui.dashTableTh}>Fees</th>
                <th className={ui.dashTableTh}>Status</th>
                <th className={ui.dashTableTh}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className={ui.dashTableRow}>
                  <td className={ui.dashTableTd}>{c.courseName}</td>
                  <td className={ui.dashTableTd}>{c.courseCode}</td>
                  <td className={ui.dashTableTd}>{c.department?.name || "N/A"}</td>
                  <td className={ui.dashTableTd}>{c.fees}</td>
                  <td className={ui.dashTableTd}>
                    {c.isActive ? (
                      <span className="font-semibold text-green-600">Active</span>
                    ) : (
                      <span className="font-semibold text-red-500">Inactive</span>
                    )}
                  </td>
                  <td className={ui.dashTableTd}>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className={cx(ui.btnBase, ui.btnSoft, "px-3 py-1.5")}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c._id)}
                        className={cx(ui.btnBase, ui.btnDanger, "px-3 py-1.5")}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(c._id)}
                        className={cx(ui.btnBase, ui.btnPrimary, "px-3 py-1.5")}
                      >
                        {c.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={showForm}
        title={editId ? "Update Course" : "Create Course"}
        onClose={closeForm}
        maxWidthClassName="max-w-3xl"
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
              form="courseForm"
              className={cx(ui.btnBase, ui.btnPrimary)}
            >
              {editId ? "Save Changes" : "Create Course"}
            </button>
          </div>
        }
      >
        <form id="courseForm" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Course Name</label>
              <input
                name="courseName"
                placeholder="e.g. BCA"
                value={formData.courseName}
                onChange={handleChange}
                className={ui.input}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Course Code</label>
              <input
                name="courseCode"
                placeholder="e.g. BCA101"
                value={formData.courseCode}
                onChange={handleChange}
                className={ui.input}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={ui.select}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Duration</label>
              <input
                name="duration"
                placeholder="e.g. 3 Years"
                value={formData.duration}
                onChange={handleChange}
                className={ui.input}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Total Semesters</label>
              <select
                name="totalSemesters"
                value={formData.totalSemesters}
                onChange={handleChange}
                className={ui.select}
                required
              >
                <option value="">Select Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Fees</label>
              <input
                name="fees"
                type="number"
                placeholder="e.g. 45000"
                value={formData.fees}
                onChange={handleChange}
                className={ui.input}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}