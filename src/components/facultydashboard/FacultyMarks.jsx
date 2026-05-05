import { useCallback, useEffect, useMemo, useState } from "react";
import { Award } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function semesterLabel(sem) {
  if (!sem) return "—";
  const c = sem.course;
  const coursePart = c && typeof c === "object" ? `${c.courseName || ""} (${c.courseCode || ""})` : "";
  const n = sem.number != null ? `Semester ${sem.number}` : "";
  return [coursePart, n].filter(Boolean).join(" · ") || "—";
}

function aggregateByExam(results) {
  const byKey = new Map();
  (Array.isArray(results) ? results : []).forEach((r) => {
    const key = `${r.examTitle || ""}__${r.semester?._id || ""}`;
    const prev = byKey.get(key) || {
      examTitle: r.examTitle || "Exam",
      semester: r.semester || null,
      scripts: 0,
    };
    prev.scripts += 1;
    byKey.set(key, prev);
  });
  return Array.from(byKey.values());
}

export default function FacultyMarks() {
  const [rows, setRows] = useState([]);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/results/faculty", { meta: { silent: true } });
      const results = res.data?.results || [];
      setRows(aggregateByExam(results));
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

  const totalScripts = useMemo(
    () => rows.reduce((sum, r) => sum + (Number(r.scripts) || 0), 0),
    [rows]
  );

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>Marks & grade sheets</h1>
        <p className="mt-1 text-sm text-slate-600">
          Summary of published result records for students assigned to you as mentor. Admin updates appear here after
          they publish grade sheets.
        </p>
      </div>

      {hint ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{hint}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cx(ui.card, "p-4 sm:p-5 sm:col-span-1")}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Published scripts</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{loading ? "…" : String(totalScripts)}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Award className="h-5 w-5 text-amber-600" aria-hidden />
            </span>
          </div>
        </div>
      </div>

      <div className={cx(ui.dashTableCard)}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Award className="h-5 w-5 text-amber-600" aria-hidden />
          <span className="text-sm font-semibold text-slate-800">Exam wise summary</span>
        </div>
        <div className={ui.dashTableScroller}>
          <table className={ui.dashTable}>
            <thead className={ui.dashTableHead}>
              <tr>
                <th className={ui.dashTableTh}>Exam</th>
                <th className={ui.dashTableTh}>Semester</th>
                <th className={ui.dashTableTh}>Published scripts</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    No published results for your mentees yet.
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={idx} className={ui.dashTableRow}>
                    <td className={cx(ui.dashTableTd, "font-medium text-slate-900")}>{r.examTitle}</td>
                    <td className={ui.dashTableTd}>{semesterLabel(r.semester)}</td>
                    <td className={cx(ui.dashTableTd, "text-sm font-semibold")}>{r.scripts}</td>
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

