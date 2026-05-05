import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function buildTeachingMap(slots) {
  const byId = new Map();
  (Array.isArray(slots) ? slots : []).forEach((s) => {
    const subj = s.subject;
    if (!subj || !subj._id) return;
    const id = String(subj._id);
    const prev = byId.get(id) || {
      subject: subj,
      weeklySlots: 0,
      courses: new Set(),
      semesters: new Set(),
    };
    prev.weeklySlots += 1;
    const sem = subj.semester;
    const course = sem && typeof sem === "object" ? sem.course : null;
    if (course && typeof course === "object") {
      prev.courses.add(`${course.courseName || ""} (${course.courseCode || ""})`.trim());
    }
    if (sem && typeof sem === "object") {
      prev.semesters.add(sem.title || (sem.number != null ? `Semester ${sem.number}` : ""));
    }
    byId.set(id, prev);
  });

  return Array.from(byId.values()).map((row) => ({
    id: row.subject._id,
    code: row.subject.code || "",
    name: row.subject.name || "",
    weeklySlots: row.weeklySlots,
    courseLabels: Array.from(row.courses).filter(Boolean),
    semesterLabels: Array.from(row.semesters).filter(Boolean),
  }));
}

export default function FacultyCourses() {
  const [rows, setRows] = useState([]);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/timetable/me", { meta: { silent: true } });
      const slots = res.data?.slots || [];
      setRows(buildTeachingMap(slots));
      setHint(res.data?.hint || "");
    } catch {
      setRows([]);
      setHint("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalSubjects = rows.length;

  const subtitle =
    "Subjects pulled from the master timetable where you are listed as faculty. Admin changes to subjects and timetable update this list.";

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>My courses & subjects</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      {hint ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">{hint}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cx(ui.card, "p-4 sm:p-5 sm:col-span-1")}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subjects</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{loading ? "…" : totalSubjects}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5">
              <BookOpen className="h-5 w-5 text-(--brand-blue)" aria-hidden />
            </span>
          </div>
        </div>
      </div>

      <div className={cx(ui.dashTableCard)}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <BookOpen className="h-5 w-5 text-(--brand-blue)" aria-hidden />
          <span className="text-sm font-semibold text-slate-800">Teaching subjects</span>
        </div>
        <div className={ui.dashTableScroller}>
          <table className={ui.dashTable}>
            <thead className={ui.dashTableHead}>
              <tr>
                <th className={ui.dashTableTh}>Code</th>
                <th className={ui.dashTableTh}>Subject</th>
                <th className={ui.dashTableTh}>Course</th>
                <th className={ui.dashTableTh}>Semester</th>
                <th className={ui.dashTableTh}>Weekly slots</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    No subjects are assigned to you yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className={ui.dashTableRow}>
                    <td className={cx(ui.dashTableTd, "font-mono text-xs text-slate-500")}>{row.code || "—"}</td>
                    <td className={cx(ui.dashTableTd, "font-medium text-slate-900")}>{row.name || "—"}</td>
                    <td className={ui.dashTableTd}>
                      {row.courseLabels.length ? row.courseLabels.join(" • ") : <span className="text-slate-400">—</span>}
                    </td>
                    <td className={ui.dashTableTd}>
                      {row.semesterLabels.length ? (
                        row.semesterLabels.join(" • ")
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={cx(ui.dashTableTd, "text-sm font-semibold")}>{row.weeklySlots}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

