import { useState } from "react";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

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
    <div className={cx("p-4 sm:p-6", ui.page)}>

      {/* HEADER */}
      <div className={cx(ui.cardHeader, "mb-4")}>
        <div>
          <h1 className={ui.h1}>Student Management</h1>
          <p className="text-sm text-slate-500">
            Search by enrollment number and manage student profiles.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className={cx(ui.btnBase, ui.btnAccent)}
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
          className={cx(ui.input, "max-w-sm")}
        />
      </div>

      {/* TABLE */}
      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[900px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Name</th>
                <th className={ui.dashTableTh}>Email</th>
                <th className={ui.dashTableTh}>Enrollment</th>
                <th className={ui.dashTableTh}>Course</th>
                <th className={ui.dashTableTh}>Department</th>
                <th className={ui.dashTableTh}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className={ui.dashTableRow}>
                  <td className={ui.dashTableTd}>{stu.name}</td>
                  <td className={ui.dashTableTd}>{stu.email}</td>
                  <td className={cx(ui.dashTableTd, "font-semibold text-(--brand-blue)")}>
                    {stu.enrollment}
                  </td>
                  <td className={ui.dashTableTd}>{stu.course}</td>
                  <td className={ui.dashTableTd}>{stu.department}</td>
                  <td className={ui.dashTableTd}>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(stu)}
                        className={cx(ui.btnBase, ui.btnPrimary, "px-3 py-1.5")}
                      >
                        View
                      </button>
                      <button type="button" className={cx(ui.btnBase, ui.btnSoft, "px-3 py-1.5")}>
                        Edit
                      </button>
                      <button type="button" className={cx(ui.btnBase, ui.btnDanger, "px-3 py-1.5")}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      <Modal
        open={Boolean(selectedStudent)}
        title="Student Details"
        onClose={() => setSelectedStudent(null)}
        maxWidthClassName="max-w-3xl"
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className={cx(ui.btnBase, ui.btnPrimary)}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedStudent ? <StudentDetails student={selectedStudent} /> : null}
      </Modal>

      {/* ADD STUDENT MODAL */}
      <Modal
        open={showForm}
        title="Add Student"
        onClose={() => setShowForm(false)}
        maxWidthClassName="max-w-2xl"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={cx(ui.btnBase, ui.btnSoft)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="studentForm"
              className={cx(ui.btnBase, ui.btnPrimary)}
            >
              Save Student
            </button>
          </div>
        }
      >
        <form id="studentForm" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              className={ui.input}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Enrollment No</label>
            <input
              type="text"
              name="enrollment"
              placeholder="e.g. ENR001"
              value={formData.enrollment}
              onChange={handleChange}
              className={ui.input}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. student@mail.com"
              value={formData.email}
              onChange={handleChange}
              className={ui.input}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Course</label>
            <input
              type="text"
              name="course"
              placeholder="e.g. BCA"
              value={formData.course}
              onChange={handleChange}
              className={ui.input}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
            <input
              type="text"
              name="department"
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={handleChange}
              className={ui.input}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Result</label>
            <select
              name="result"
              value={formData.result}
              onChange={handleChange}
              className={ui.select}
            >
              <option value="">Select Result</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function StudentDetails({ student }) {
  return (
    <div className="space-y-5">
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
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2 text-slate-900">{title}</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value || "N/A"}</p>
    </div>
  );
}