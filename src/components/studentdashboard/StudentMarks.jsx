import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function lineLabel(line) {
  if (line.subject && typeof line.subject === "object") {
    return `${line.subject.name || ""} (${line.subject.code || ""})`.trim() || line.subjectLabel || "Subject";
  }
  return line.subjectLabel || "Subject";
}

function flattenResults(results) {
  return (Array.isArray(results) ? results : []).flatMap((r) =>
    (r.lines || []).map((line, idx) => ({
      key: `${r._id}-${idx}`,
      examTitle: r.examTitle || "Exam",
      subject: lineLabel(line),
      obtained: Number(line.obtained) || 0,
      maxMarks: Number(line.maxMarks) || 0,
      grade: line.grade || "—",
    }))
  );
}

export default function StudentMarks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/results/me", { meta: { silent: true } });
      setRows(flattenResults(res.data?.results || []));
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

  const avgPct = useMemo(() => {
    if (!rows.length) return 0;
    const totalObt = rows.reduce((sum, r) => sum + r.obtained, 0);
    const totalMax = rows.reduce((sum, r) => sum + r.maxMarks, 0);
    return totalMax ? Math.round((totalObt / totalMax) * 100) : 0;
  }, [rows]);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>My marks</h1>
        <p className="mt-1 text-sm text-slate-600">
          Subject-wise marks from your published result records.
        </p>
      </div>

      {hint ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{hint}</div>
      ) : null}

      <div className={cx(ui.card, "p-5")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average score</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{loading ? "…" : `${avgPct}%`}</p>
          </div>
          <BarChart3 className="h-5 w-5 text-(--brand-blue)" aria-hidden />
        </div>
      </div>

      <div className={cx(ui.dashTableCard)}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <BarChart3 className="h-5 w-5 text-(--brand-blue)" aria-hidden />
          <span className="text-sm font-semibold text-slate-800">Marks summary</span>
        </div>
        <div className={ui.dashTableScroller}>
          <table className={ui.dashTable}>
            <thead className={ui.dashTableHead}>
              <tr>
                <th className={ui.dashTableTh}>Exam</th>
                <th className={ui.dashTableTh}>Subject</th>
                <th className={ui.dashTableTh}>Obtained</th>
                <th className={ui.dashTableTh}>Max</th>
                <th className={ui.dashTableTh}>Grade</th>
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
                    No marks available yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.key} className={ui.dashTableRow}>
                    <td className={ui.dashTableTd}>{row.examTitle}</td>
                    <td className={ui.dashTableTd}>{row.subject}</td>
                    <td className={ui.dashTableTd}>{row.obtained}</td>
                    <td className={ui.dashTableTd}>{row.maxMarks}</td>
                    <td className={ui.dashTableTd}>{row.grade}</td>
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

