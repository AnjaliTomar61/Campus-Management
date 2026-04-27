import { useEffect, useState } from "react";
import axios from "axios";

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

  const API = "http://localhost:3000/api/course";

  // FETCH
  const fetchCourses = async () => {
    const res = await axios.get(`${API}/all`);
    setCourses(res.data.courses);
  };

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:3000/api/department/all");
    setDepartments(res.data.departments);
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
        await axios.put(`${API}/${editId}`, formData);
      } else {
        await axios.post(`${API}/create`, formData);
      }

      setShowForm(false);
      setEditId(null);
      resetForm();
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
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
      await axios.delete(`${API}/${id}`);
      fetchCourses();
    }
  };

  // TOGGLE
  const handleToggle = async (id) => {
    await axios.patch(`${API}/toggle/${id}`);
    fetchCourses();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>

        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            resetForm();
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          + Add Course
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Department</th>
              <th className="p-3">Fees</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.courseName}</td>
                <td className="p-3">{c.courseCode}</td>
                <td className="p-3">{c.department?.name || "N/A"}</td>
                <td className="p-3">{c.fees}</td>

                <td className="p-3">
                  {c.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(c)} className="bg-yellow-400 px-3 py-1 rounded">
                    Edit
                  </button>

                  <button onClick={() => handleDelete(c._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>

                  <button onClick={() => handleToggle(c._id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                    {c.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* BLUR BACKGROUND */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setShowForm(false)}
          ></div>

          {/* MODAL */}
          <div className="relative bg-white w-[90%] max-w-2xl rounded-xl shadow-xl p-6">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">
              {editId ? "Update Course" : "Add Course"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

              <input name="courseName" placeholder="Course Name" value={formData.courseName} onChange={handleChange} className="border p-2 rounded" required />
              <input name="courseCode" placeholder="Course Code" value={formData.courseCode} onChange={handleChange} className="border p-2 rounded" required />

              <select name="department" value={formData.department} onChange={handleChange} className="border p-2 rounded" required>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="border p-2 rounded" />
              {/* <input name="totalSemesters" type="number" placeholder="Semesters" value={formData.totalSemesters} onChange={handleChange} className="border p-2 rounded" /> */}
              <select
  name="totalSemesters"
  value={formData.totalSemesters}
  onChange={handleChange}
  className="border p-2 rounded"
  required
>
  <option value="">Select Semesters</option>

  {[1,2,3,4,5,6,7,8].map((sem) => (
    <option key={sem} value={sem}>
      Semester {sem}
    </option>
  ))}
</select>
              <input name="fees" type="number" placeholder="Fees" value={formData.fees} onChange={handleChange} className="border p-2 rounded" />

              <button className="col-span-2 bg-green-500 text-white py-2 rounded">
                {editId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}