import { useState } from "react";

export default function Student() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      enrollment: "ENR001",
      course: "BCA",
      department: "Computer Science",
      result: "Pass",
      gender: "Male",
      dob: "2002-05-12",
      aadhaar: "1234-5678-9012",
      address: "Lucknow, UP",
      father: "Ramesh Sharma",
      mother: "Sunita Sharma",
      prevSchool: "ABC School",
      documents: "Complete",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollment: "",
    course: "",
    department: "",
    result: "",
  });

  // 🔍 FILTER STUDENTS
  const filteredStudents = students.filter((stu) =>
    stu.enrollment.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStudent = {
      id: Date.now(),
      ...formData,
      result: formData.result || "Pending",
    };

    setStudents([...students, newStudent]);
    setShowForm(false);

    setFormData({
      name: "",
      email: "",
      enrollment: "",
      course: "",
      department: "",
      result: "",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student Management</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          + Add Student
        </button>
      </div>

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Enrollment No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded w-full max-w-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Enrollment</th>
              <th>Course</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((stu) => (
              <tr key={stu.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{stu.name}</td>
                <td>{stu.email}</td>
                <td className="font-semibold text-blue-600">
                  {stu.enrollment}
                </td>
                <td>{stu.course}</td>
                <td>{stu.department}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => setSelectedStudent(stu)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>

                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* ADD STUDENT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setShowForm(false)}
          ></div>

          <div className="relative bg-white w-[90%] max-w-xl rounded-xl shadow-xl p-6">

            <h2 className="text-xl font-bold mb-4 text-center">
              Add Student
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                required
              />

              <input
                type="text"
                name="enrollment"
                placeholder="Enrollment No"
                value={formData.enrollment}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />

              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />

              <select
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              >
                <option value="">Select Result</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* VIEW MODAL */
function StudentModal({ student, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white w-[90%] max-w-3xl rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">Student Details</h2>

        <Section title="Basic Info">
          <Info label="Name" value={student.name} />
          <Info label="Enrollment" value={student.enrollment} />
          <Info label="Email" value={student.email} />
        </Section>

        <Section title="Academic Info">
          <Info label="Course" value={student.course} />
          <Info label="Department" value={student.department} />
          <Info label="Result" value={student.result} />
        </Section>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong> {value || "N/A"}
    </p>
  );
}