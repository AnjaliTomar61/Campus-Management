import { useCallback, useEffect, useState } from "react";
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

function lineLabel(line) {
  if (line.subject && typeof line.subject === "object") {
    return `${line.subject.name || ""} (${line.subject.code || ""})`.trim() || line.subjectLabel || "Subject";
  }
  return line.subjectLabel || "Subject";
}

/**
 * @param {"student"|"faculty"} variant
 */
export default function ResultsView({ variant = "student" }) {
  const [rows, setRows] = useState([]);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = variant === "faculty" ? "/api/results/faculty" : "/api/results/me";
      const res = await api.get(url, { meta: { silent: true } });
      setRows(res.data?.results || []);
      setHint(res.data?.hint || "");
    } catch {
      setRows([]);
      setHint("");
    } finally {
      setLoading(false);
    }
  }, [variant]);

  useEffect(() => {
    load();
  }, [load]);

  const title = variant === "faculty" ? "Mentee results" : "My results";
  const subtitle =
    variant === "faculty"
      ? "Published grade sheets for students assigned to you as faculty mentor. Draft or unpublished records stay hidden."
      : "Published exams and assessments only. Contact the office if something is missing.";

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      {hint ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{hint}</div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500">No published results to show.</p>
      ) : (
        <div className="space-y-5">
          {rows.map((r) => (
            <article key={r._id} className={cx(ui.card, "overflow-hidden p-0")}>
              <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Award className="h-5 w-5 text-amber-600" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-slate-900">{r.examTitle}</h2>
                    <p className="mt-0.5 text-xs text-slate-600">{semesterLabel(r.semester)}</p>
                    {variant === "faculty" && r.student ? (
                      <p className="mt-1 text-sm font-medium text-(--brand-blue)">
                        {r.student.name}
                        <span className="ml-2 font-normal text-slate-500">{r.student.email}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
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
                    {(r.lines || []).map((line, idx) => (
                      <tr key={idx} className={ui.dashTableRow}>
                        <td className={ui.dashTableTd}>{lineLabel(line)}</td>
                        <td className={ui.dashTableTd}>{line.obtained}</td>
                        <td className={ui.dashTableTd}>{line.maxMarks}</td>
                        <td className={ui.dashTableTd}>{line.grade || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {r.remarks ? (
                <p className="border-t border-slate-100 px-5 py-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Remarks: </span>
                  {r.remarks}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
