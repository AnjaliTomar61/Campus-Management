import { useCallback, useEffect, useMemo, useState } from "react";
import { UserRound, Mail, Phone, GraduationCap, Award } from "lucide-react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

function emptyAddr() {
  return { street: "", city: "", state: "", pincode: "" };
}

function emptyForm() {
  return {
    enrollmentNo: "",
    department: "",
    course: "",
    currentSemester: "",
    admissionStatus: "pending",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: "",
    bloodGroup: "",
    documentsNote: "",
    currentAddress: emptyAddr(),
    permanentAddress: emptyAddr(),
  };
}

function profileToForm(p) {
  if (!p) return emptyForm();
  const courseId = p.course?._id ? String(p.course._id) : p.course ? String(p.course) : "";
  return {
    enrollmentNo: p.enrollmentNo ?? "",
    department: p.department?._id ? String(p.department._id) : p.department ? String(p.department) : "",
    course: courseId,
    currentSemester: p.currentSemester?._id
      ? String(p.currentSemester._id)
      : p.currentSemester
        ? String(p.currentSemester)
        : "",
    admissionStatus: p.admissionStatus || "pending",
    guardianName: p.guardianName ?? "",
    guardianPhone: p.guardianPhone ?? "",
    guardianRelation: p.guardianRelation ?? "",
    bloodGroup: p.bloodGroup ?? "",
    documentsNote: p.documentsNote ?? "",
    currentAddress: { ...emptyAddr(), ...(p.currentAddress || {}) },
    permanentAddress: { ...emptyAddr(), ...(p.permanentAddress || {}) },
  };
}

function fmtGender(g) {
  if (!g) return "—";
  return String(g).charAt(0).toUpperCase() + String(g).slice(1);
}

function emptyMarks() {
  return { examTitle: "Mid Term", published: true, remarks: "", lines: [] };
}

function linesFromSubjects(subjects) {
  return (Array.isArray(subjects) ? subjects : []).map((s) => ({
    subject: s._id,
    subjectLabel: "",
    maxMarks: 100,
    obtained: 0,
    grade: "",
  }));
}

export default function FacultyAssignedStudents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [marksOpen, setMarksOpen] = useState(false);
  const [marksLoading, setMarksLoading] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [marks, setMarks] = useState(emptyMarks());
  const [marksSaving, setMarksSaving] = useState(false);

  const loadSemesters = useCallback(async (courseId) => {
    if (!courseId) {
      setSemesters([]);
      return;
    }
    try {
      const res = await api.get("/api/semesters/", { params: { courseId } });
      setSemesters(res.data?.semesters || []);
    } catch {
      setSemesters([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    const [stRes, depRes, cRes] = await Promise.all([
      api.get("/api/v1/user/faculty/assigned-students"),
      api.get("/api/department/all").catch(() => ({ data: {} })),
      api.get("/api/course/all").catch(() => ({ data: {} })),
    ]);
    setRows(stRes.data?.students || []);
    setDepartments((depRes.data?.departments || []).filter((d) => d.isActive !== false));
    setCourses((cRes.data?.courses || []).filter((c) => c.isActive !== false));
  }, []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        await refresh();
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (!form.course) {
      setSemesters([]);
      return;
    }
    loadSemesters(form.course);
  }, [form.course, loadSemesters]);

  const filteredCourses = !form.department
    ? courses
    : courses.filter((co) => {
        const dep = co.department;
        const id = dep && typeof dep === "object" ? dep._id : dep;
        return id && String(id) === String(form.department);
      });

  const openStudentModal = async (row) => {
    setSelected(row);
    setDetailUser(null);
    setDetailLoading(true);
    setForm(profileToForm(row.profile));
    const cid = row.profile?.course?._id ? String(row.profile.course._id) : row.profile?.course ? String(row.profile.course) : "";
    if (cid) loadSemesters(cid);
    try {
      const res = await api.get(`/api/v1/user/faculty/students/${row.userId}/detail`);
      setDetailUser(res.data?.user || null);
      if (res.data?.profile) {
        setForm(profileToForm(res.data.profile));
        const c = res.data.profile.course?._id
          ? String(res.data.profile.course._id)
          : res.data.profile.course
            ? String(res.data.profile.course)
            : "";
        if (c) loadSemesters(c);
      }
    } catch {
      setDetailUser(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setDetailUser(null);
    setForm(emptyForm());
    setMarksOpen(false);
    setSubjectOptions([]);
    setMarks(emptyMarks());
  };

  const openMarks = async () => {
    if (!selected) return;
    const semesterId = form.currentSemester || selected?.profile?.currentSemester?._id || "";
    if (!semesterId) return;
    setMarksOpen(true);
    setMarksLoading(true);
    try {
      const res = await api.get("/api/subjects", { params: { semesterId }, meta: { silent: true } });
      const subs = res.data?.subjects || [];
      setSubjectOptions(subs);
      setMarks((m) => ({ ...m, lines: linesFromSubjects(subs) }));
    } catch {
      setSubjectOptions([]);
      setMarks((m) => ({ ...m, lines: [] }));
    } finally {
      setMarksLoading(false);
    }
  };

  const saveMarks = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setMarksSaving(true);
    try {
      await api.put(
        `/api/results/faculty/students/${selected.userId}`,
        {
          semester: form.currentSemester || null,
          examTitle: marks.examTitle,
          published: marks.published,
          remarks: marks.remarks,
          lines: marks.lines,
        },
        { meta: { successMessage: "Marks uploaded" } }
      );
      setMarksOpen(false);
    } finally {
      setMarksSaving(false);
    }
  };

  const setAddr = (which, field, value) => {
    setForm((prev) => ({
      ...prev,
      [which]: { ...prev[which], [field]: value },
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(
        `/api/v1/user/faculty/students/${selected.userId}/academic`,
        {
          enrollmentNo: form.enrollmentNo.trim(),
          department: form.department || null,
          course: form.course || null,
          currentSemester: form.currentSemester || null,
          admissionStatus: form.admissionStatus,
          guardianName: form.guardianName.trim(),
          guardianPhone: form.guardianPhone.trim(),
          guardianRelation: form.guardianRelation.trim(),
          bloodGroup: form.bloodGroup.trim(),
          documentsNote: form.documentsNote,
          currentAddress: form.currentAddress,
          permanentAddress: form.permanentAddress,
        },
        { meta: { successMessage: "Student record saved" } }
      );
      await refresh();
      closeModal();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cx("p-6", ui.page)}>
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className={cx("p-4 sm:p-6 lg:p-8", ui.page)}>
      <div className="mb-6 max-w-3xl">
        <h1 className={ui.h1}>My assigned students</h1>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Students the administration has linked to you as mentor. Open a row to see full contact and academic
          information, update program details, and help maintain guardian and address records on their profile.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className={cx(ui.card, "max-w-xl p-6 text-sm text-slate-600")}>
          No students are assigned to you yet. When an administrator sets you as the mentor on a student record, they
          will appear in this list.
        </div>
      ) : (
        <div className={ui.dashTableCard}>
          <div className={ui.dashTableScroller}>
            <table className={cx(ui.dashTable, "min-w-[960px]")}>
              <thead>
                <tr className={ui.dashTableHead}>
                  <th className={ui.dashTableTh}>Student</th>
                  <th className={ui.dashTableTh}>Mobile</th>
                  <th className={ui.dashTableTh}>Enrollment</th>
                  <th className={ui.dashTableTh}>Department</th>
                  <th className={ui.dashTableTh}>Course</th>
                  <th className={ui.dashTableTh}>Semester</th>
                  <th className={ui.dashTableTh}>Admission</th>
                  <th className={ui.dashTableTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const p = row.profile || {};
                  const u = p.user || {};
                  return (
                    <tr key={row.userId} className={ui.dashTableRow}>
                      <td className={ui.dashTableTd}>
                        <div className="font-medium text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-500">{row.email}</div>
                      </td>
                      <td className={ui.dashTableTd}>{u.mobile || "—"}</td>
                      <td className={ui.dashTableTd}>
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{p.enrollmentNo || "—"}</code>
                      </td>
                      <td className={ui.dashTableTd}>{p.department?.name || "—"}</td>
                      <td className={ui.dashTableTd}>
                        {p.course?.courseName || "—"}
                        {p.course?.courseCode ? (
                          <span className="block text-xs text-slate-500">{p.course.courseCode}</span>
                        ) : null}
                      </td>
                      <td className={ui.dashTableTd}>
                        {p.currentSemester ? `Sem ${p.currentSemester.number}` : "—"}
                        {p.currentSemester?.title ? (
                          <span className="block max-w-[140px] truncate text-xs text-slate-500">{p.currentSemester.title}</span>
                        ) : null}
                      </td>
                      <td className={ui.dashTableTd}>
                        <span className="capitalize">{p.admissionStatus || "—"}</span>
                      </td>
                      <td className={ui.dashTableTd}>
                        <button
                          type="button"
                          onClick={() => openStudentModal(row)}
                          className={cx(ui.btnBase, ui.btnPrimary, "px-3 py-1.5 text-sm")}
                        >
                          View and update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        title={selected ? `Student — ${selected.name}` : ""}
        onClose={closeModal}
        maxWidthClassName="max-w-3xl"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeModal} className={cx(ui.btnBase, ui.btnSoft)}>
              Cancel
            </button>
            <button
              type="submit"
              form="faculty-student-full-form"
              disabled={saving || detailLoading}
              className={cx(ui.btnBase, ui.btnPrimary)}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      >
        {selected ? (
          <div className="max-h-[min(72vh,36rem)] overflow-y-auto pr-1">
            {detailLoading ? (
              <p className="text-sm text-slate-500">Loading student details…</p>
            ) : null}

            <form id="faculty-student-full-form" onSubmit={save} className="space-y-8 pt-1">
              <section className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <UserRound className="h-4 w-4" aria-hidden />
                  Student contact (read-only)
                </h3>
                {detailUser ? (
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-slate-500">Name</dt>
                      <dd className="font-medium text-slate-900">{detailUser.name}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="h-3 w-3" aria-hidden />
                        Email
                      </dt>
                      <dd className="text-slate-800">{detailUser.email}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1 text-xs text-slate-500">
                        <Phone className="h-3 w-3" aria-hidden />
                        Mobile
                      </dt>
                      <dd>{detailUser.mobile || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Gender</dt>
                      <dd>{fmtGender(detailUser.gender)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Date of birth</dt>
                      <dd>{detailUser.dob || "—"}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-slate-500">Bio</dt>
                      <dd className="whitespace-pre-wrap text-slate-800">{detailUser.bio?.trim() ? detailUser.bio : "—"}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-xs text-slate-500">
                    Showing roster data only. Contact fields load when detail request succeeds.
                  </p>
                )}
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <GraduationCap className="h-4 w-4" aria-hidden />
                  Academic record (you can update)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Enrollment number">
                    <input
                      className={ui.input}
                      value={form.enrollmentNo}
                      onChange={(e) => setForm((f) => ({ ...f, enrollmentNo: e.target.value }))}
                    />
                  </Field>
                  <Field label="Admission status">
                    <select
                      className={ui.select}
                      value={form.admissionStatus}
                      onChange={(e) => setForm((f) => ({ ...f, admissionStatus: e.target.value }))}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </Field>
                  <Field label="Department" className="sm:col-span-2">
                    <select
                      className={ui.select}
                      value={form.department}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          department: e.target.value,
                          course: "",
                          currentSemester: "",
                        }))
                      }
                    >
                      <option value="">—</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Course" className="sm:col-span-2">
                    <select
                      className={ui.select}
                      value={form.course}
                      onChange={(e) => setForm((f) => ({ ...f, course: e.target.value, currentSemester: "" }))}
                    >
                      <option value="">—</option>
                      {filteredCourses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.courseName} ({c.courseCode})
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Current semester" className="sm:col-span-2">
                    <select
                      className={ui.select}
                      value={form.currentSemester}
                      onChange={(e) => setForm((f) => ({ ...f, currentSemester: e.target.value }))}
                      disabled={!form.course}
                    >
                      <option value="">—</option>
                      {semesters.map((s) => (
                        <option key={s._id} value={s._id}>
                          Sem {s.number}
                          {s.title ? ` — ${s.title}` : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openMarks}
                    disabled={!form.currentSemester}
                    className={cx(ui.btnBase, ui.btnAccent)}
                    title={!form.currentSemester ? "Set current semester first" : ""}
                  >
                    <Award className="h-4 w-4" aria-hidden />
                    Upload marks
                  </button>
                  {!form.currentSemester ? (
                    <p className="self-center text-xs text-slate-500">
                      Select a <span className="font-semibold">current semester</span> to load subjects.
                    </p>
                  ) : null}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Guardian &amp; profile (you can update)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Guardian name">
                    <input
                      className={ui.input}
                      value={form.guardianName}
                      onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))}
                    />
                  </Field>
                  <Field label="Guardian phone">
                    <input
                      className={ui.input}
                      value={form.guardianPhone}
                      onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))}
                    />
                  </Field>
                  <Field label="Relation to student" className="sm:col-span-2">
                    <input
                      className={ui.input}
                      value={form.guardianRelation}
                      onChange={(e) => setForm((f) => ({ ...f, guardianRelation: e.target.value }))}
                    />
                  </Field>
                  <Field label="Blood group">
                    <input
                      className={ui.input}
                      value={form.bloodGroup}
                      onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value }))}
                      placeholder="e.g. B+"
                    />
                  </Field>
                  <Field label="Documents note" className="sm:col-span-2">
                    <textarea
                      className={ui.textarea}
                      rows={2}
                      value={form.documentsNote}
                      onChange={(e) => setForm((f) => ({ ...f, documentsNote: e.target.value }))}
                    />
                  </Field>
                </div>

                <AddressBlock
                  title="Current address"
                  prefix="currentAddress"
                  addr={form.currentAddress}
                  onChange={setAddr}
                />
                <AddressBlock
                  title="Permanent address"
                  prefix="permanentAddress"
                  addr={form.permanentAddress}
                  onChange={setAddr}
                />
              </section>
            </form>

            <Modal
              open={marksOpen}
              title="Upload marks"
              onClose={() => setMarksOpen(false)}
              maxWidthClassName="max-w-4xl"
              footer={
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setMarksOpen(false)} className={cx(ui.btnBase, ui.btnSoft)}>
                    Close
                  </button>
                  <button
                    type="submit"
                    form="faculty-marks-form"
                    disabled={marksSaving || marksLoading}
                    className={cx(ui.btnBase, ui.btnPrimary)}
                  >
                    {marksSaving ? "Saving…" : "Save marks"}
                  </button>
                </div>
              }
            >
              <form id="faculty-marks-form" onSubmit={saveMarks} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Exam title">
                    <input
                      className={ui.input}
                      value={marks.examTitle}
                      onChange={(e) => setMarks((m) => ({ ...m, examTitle: e.target.value }))}
                      placeholder="e.g. Mid Term"
                    />
                  </Field>
                  <Field label="Publish for student">
                    <select
                      className={ui.select}
                      value={marks.published ? "yes" : "no"}
                      onChange={(e) => setMarks((m) => ({ ...m, published: e.target.value === "yes" }))}
                    >
                      <option value="yes">Yes (student can see)</option>
                      <option value="no">No (draft)</option>
                    </select>
                  </Field>
                </div>
                <Field label="Remarks">
                  <textarea
                    className={ui.textarea}
                    rows={2}
                    value={marks.remarks}
                    onChange={(e) => setMarks((m) => ({ ...m, remarks: e.target.value }))}
                  />
                </Field>

                <div className={cx(ui.dashTableCard)}>
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-800">Subject marks</div>
                    <div className="text-xs text-slate-500">{subjectOptions.length} subject(s)</div>
                  </div>
                  <div className={ui.dashTableScroller}>
                    <table className={ui.dashTable}>
                      <thead className={ui.dashTableHead}>
                        <tr>
                          <th className={ui.dashTableTh}>Subject</th>
                          <th className={ui.dashTableTh}>Obtained</th>
                          <th className={ui.dashTableTh}>Max</th>
                          <th className={ui.dashTableTh}>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marksLoading ? (
                          <tr>
                            <td colSpan={4} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                              Loading subjects…
                            </td>
                          </tr>
                        ) : marks.lines.length === 0 ? (
                          <tr>
                            <td colSpan={4} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                              No subjects found for this semester.
                            </td>
                          </tr>
                        ) : (
                          marks.lines.map((line, idx) => (
                            <tr key={line.subject || idx} className={ui.dashTableRow}>
                              <td className={ui.dashTableTd}>
                                <span className="font-medium text-slate-900">
                                  {subjectOptions.find((s) => String(s._id) === String(line.subject))?.name || "—"}
                                </span>
                                {subjectOptions.find((s) => String(s._id) === String(line.subject))?.code ? (
                                  <span className="ml-1 text-xs text-slate-500">
                                    ({subjectOptions.find((s) => String(s._id) === String(line.subject))?.code})
                                  </span>
                                ) : null}
                              </td>
                              <td className={ui.dashTableTd}>
                                <input
                                  className={cx(ui.input, "py-2")}
                                  type="number"
                                  min="0"
                                  value={line.obtained}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setMarks((m) => {
                                      const next = [...m.lines];
                                      next[idx] = { ...next[idx], obtained: v === "" ? 0 : Number(v) };
                                      return { ...m, lines: next };
                                    });
                                  }}
                                />
                              </td>
                              <td className={ui.dashTableTd}>
                                <input
                                  className={cx(ui.input, "py-2")}
                                  type="number"
                                  min="0"
                                  value={line.maxMarks}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setMarks((m) => {
                                      const next = [...m.lines];
                                      next[idx] = { ...next[idx], maxMarks: v === "" ? 0 : Number(v) };
                                      return { ...m, lines: next };
                                    });
                                  }}
                                />
                              </td>
                              <td className={ui.dashTableTd}>
                                <input
                                  className={cx(ui.input, "py-2")}
                                  value={line.grade}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setMarks((m) => {
                                      const next = [...m.lines];
                                      next[idx] = { ...next[idx], grade: v };
                                      return { ...m, lines: next };
                                    });
                                  }}
                                  placeholder="A / B+"
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            </Modal>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function Field({ label, className, children }) {
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </div>
  );
}

function AddressBlock({ title, prefix, addr, onChange }) {
  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-xs font-semibold text-slate-700">{title}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Street">
          <input className={ui.input} value={addr.street} onChange={(e) => onChange(prefix, "street", e.target.value)} />
        </Field>
        <Field label="City">
          <input className={ui.input} value={addr.city} onChange={(e) => onChange(prefix, "city", e.target.value)} />
        </Field>
        <Field label="State">
          <input className={ui.input} value={addr.state} onChange={(e) => onChange(prefix, "state", e.target.value)} />
        </Field>
        <Field label="Pincode">
          <input className={ui.input} value={addr.pincode} onChange={(e) => onChange(prefix, "pincode", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}
