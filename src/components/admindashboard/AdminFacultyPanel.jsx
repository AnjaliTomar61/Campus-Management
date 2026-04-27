import { useCallback, useEffect, useState } from "react";
import { Users, UserPlus, BadgeCheck, Eye } from "lucide-react";
import { api } from "../../lib/apiClient";
import FacultyForm from "./FacultyForm";
import AdminFacultyEmployment from "./AdminFacultyEmployment";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

function fmt(v) {
  if (v == null || v === "") return "—";
  return String(v);
}

function fmtAddress(addr) {
  if (!addr || typeof addr !== "object") return "—";
  const parts = [addr.street, addr.city, addr.state, addr.pincode].map((x) => (x != null ? String(x).trim() : "")).filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

function refLabel(obj, primary, secondary) {
  if (!obj || typeof obj !== "object") return "—";
  const a = obj[primary];
  const b = obj[secondary];
  if (a && b) return `${a} (${b})`;
  return a || b || "—";
}

const TABS = [
  { id: "register", label: "Register staff", icon: UserPlus, desc: "Create portal accounts for new faculty" },
  { id: "placement", label: "Placement & roles", icon: BadgeCheck, desc: "Department, designation, employee ID" },
  { id: "directory", label: "Directory", icon: Users, desc: "All faculty accounts in the system" },
];

/** Single admin area: all faculty-related workflows in tabs */
export default function AdminFacultyPanel() {
  const [tab, setTab] = useState("register");
  const [facultyRows, setFacultyRows] = useState([]);
  const [loadingDir, setLoadingDir] = useState(false);
  const [detailUserId, setDetailUserId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  const loadDirectory = useCallback(async () => {
    setLoadingDir(true);
    try {
      const res = await api.get("/api/v1/user/getalluser");
      const all = res.data?.data || [];
      setFacultyRows(all.filter((u) => u.role === "faculty"));
    } catch {
      setFacultyRows([]);
    } finally {
      setLoadingDir(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "directory") loadDirectory();
  }, [tab, loadDirectory]);

  const openFacultyDetail = async (userId) => {
    setDetailUserId(userId);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await api.get(`/api/v1/user/admin/faculty/${userId}/directory-detail`);
      setDetail(res.data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeFacultyDetail = () => {
    setDetailUserId(null);
    setDetail(null);
    setDetailLoading(false);
  };

  return (
    <div className={cx("p-4 sm:p-6 lg:p-8", ui.page)}>
      <div className="mb-6">
        <h1 className={cx(ui.h1, "tracking-tight")}>Faculty</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
          Register new staff, set official placement and titles, and browse everyone with a faculty role.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Faculty sections"
        className="mb-6 flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-sm sm:flex-row sm:p-1"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cx(
                "flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition sm:py-3.5",
                active
                  ? "bg-[var(--brand-navy)] text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <span
                className={cx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-white/15 text-amber-200" : "bg-slate-100 text-[var(--brand-blue)]"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{t.label}</span>
                <span className={cx("mt-0.5 block text-xs leading-snug", active ? "text-white/80" : "text-slate-500")}>
                  {t.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className={cx(
          "rounded-2xl border border-slate-200/90 bg-white shadow-sm",
          tab === "register" ? "overflow-hidden" : "p-4 sm:p-6"
        )}
      >
        {tab === "register" ? (
          <div className="border-t border-slate-100 bg-slate-50/50">
            <FacultyForm embedded />
          </div>
        ) : null}

        {tab === "placement" ? <AdminFacultyEmployment embedded /> : null}

        {tab === "directory" ? (
          <div>
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {loadingDir ? "Loading…" : `${facultyRows.length} faculty`}
              </p>
              <button type="button" onClick={loadDirectory} className={cx(ui.btnBase, ui.btnSoft, "text-sm")}>
                Refresh list
              </button>
            </div>
            <div className={ui.dashTableCard}>
              <div className={ui.dashTableScroller}>
                <table className={cx(ui.dashTable, "min-w-[520px]")}>
                  <thead>
                    <tr className={ui.dashTableHead}>
                      <th className={ui.dashTableTh}>Name</th>
                      <th className={ui.dashTableTh}>Email</th>
                      <th className={ui.dashTableTh}>Mobile</th>
                      <th className={ui.dashTableTh}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyRows.map((f) => (
                      <tr key={f._id} className={ui.dashTableRow}>
                        <td className={cx(ui.dashTableTd, "font-semibold text-slate-900")}>{f.name}</td>
                        <td className={cx(ui.dashTableTd, "text-slate-600")}>{f.email}</td>
                        <td className={ui.dashTableTd}>{f.mobile || "—"}</td>
                        <td className={ui.dashTableTd}>
                          <button
                            type="button"
                            onClick={() => openFacultyDetail(f._id)}
                            className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-1.5 text-xs")}
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden />
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              To change department or designation for someone, open the <strong>Placement & roles</strong> tab and
              select them there. Use <strong>View details</strong> to see full profile and assigned students.
            </p>
          </div>
        ) : null}
      </div>

      <Modal
        open={Boolean(detailUserId)}
        title="Faculty details"
        onClose={closeFacultyDetail}
        maxWidthClassName="max-w-3xl"
        footer={
          <button type="button" className={cx(ui.btnBase, ui.btnPrimary)} onClick={closeFacultyDetail}>
            Close
          </button>
        }
      >
        {detailLoading ? (
          <p className="text-sm text-slate-500">Loading profile…</p>
        ) : !detail?.user ? (
          <p className="text-sm text-red-600">Could not load faculty details.</p>
        ) : (
          <div className="max-h-[min(70vh,32rem)] space-y-6 overflow-y-auto pr-1">
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Account and contact</h3>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Name</dt>
                  <dd className="font-medium text-slate-900">{detail.user.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Email</dt>
                  <dd className="text-slate-800">{detail.user.email}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Mobile</dt>
                  <dd>{fmt(detail.user.mobile)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Gender</dt>
                  <dd className="capitalize">{fmt(detail.user.gender)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Date of birth</dt>
                  <dd>{fmt(detail.user.dob)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Bio</dt>
                  <dd className="whitespace-pre-wrap">{fmt(detail.user.bio)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Address</dt>
                  <dd>{fmtAddress(detail.user.address)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Skills</dt>
                  <dd>
                    {Array.isArray(detail.user.skills) && detail.user.skills.length
                      ? detail.user.skills.join(", ")
                      : "—"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Interests</dt>
                  <dd>
                    {Array.isArray(detail.user.interests) && detail.user.interests.length
                      ? detail.user.interests.join(", ")
                      : "—"}
                  </dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">HR and placement</h3>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Employee ID (HR)</dt>
                  <dd>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                      {detail.employment?.employeeId || detail.profile?.employeeId || "—"}
                    </code>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">HR department</dt>
                  <dd>{fmt(detail.employment?.departmentName)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Designation (HR)</dt>
                  <dd>{fmt(detail.employment?.designation)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">HR active</dt>
                  <dd>{detail.employment ? (detail.employment.isActive !== false ? "Yes" : "No") : "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Catalog department</dt>
                  <dd>{refLabel(detail.profile?.department, "name", "code")}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Profile designation</dt>
                  <dd>{fmt(detail.profile?.designation)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Active (teaching profile)</dt>
                  <dd>{detail.profile ? (detail.profile.isActive !== false ? "Yes" : "No") : "—"}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Teaching profile</h3>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Office</dt>
                  <dd>{fmt(detail.profile?.officeRoom)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Specialization</dt>
                  <dd>{fmt(detail.profile?.specialization)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Qualification</dt>
                  <dd>{fmt(detail.profile?.qualification)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Experience (years)</dt>
                  <dd>{detail.profile?.experienceYears != null ? detail.profile.experienceYears : "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Subjects</dt>
                  <dd>
                    {Array.isArray(detail.profile?.subjects) && detail.profile.subjects.length
                      ? detail.profile.subjects.join(", ")
                      : "—"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Experience summary</dt>
                  <dd className="whitespace-pre-wrap text-slate-700">{fmt(detail.profile?.experienceSummary)}</dd>
                </div>
              </dl>
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned students</h3>
                <span className="text-xs text-slate-500">{detail.assignedCount ?? 0} total</span>
              </div>
              {detail.assignedStudents?.length ? (
                <div className={cx(ui.dashTableCard, "border-slate-200")}>
                  <div className={ui.dashTableScroller}>
                    <table className={cx(ui.dashTable, "min-w-[520px] text-xs")}>
                      <thead>
                        <tr className={ui.dashTableHead}>
                          <th className={ui.dashTableTh}>Name</th>
                          <th className={ui.dashTableTh}>Email</th>
                          <th className={ui.dashTableTh}>Enrollment</th>
                          <th className={ui.dashTableTh}>Program</th>
                          <th className={ui.dashTableTh}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.assignedStudents.map((s) => (
                          <tr key={s.userId} className={ui.dashTableRow}>
                            <td className={cx(ui.dashTableTd, "font-medium text-slate-900")}>{s.name}</td>
                            <td className={ui.dashTableTd}>{s.email}</td>
                            <td className={ui.dashTableTd}>
                              <code className="rounded bg-slate-100 px-1">{s.enrollmentNo || "—"}</code>
                            </td>
                            <td className={ui.dashTableTd}>{refLabel(s.course, "courseName", "courseCode")}</td>
                            <td className={ui.dashTableTd}>
                              <span className="capitalize">{fmt(s.admissionStatus)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  No students are assigned to this faculty member yet. Assign mentors from the{" "}
                  <strong>Students</strong> area (academic record).
                </p>
              )}
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
}
