import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Users, GraduationCap } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

const TZ = "Asia/Kolkata";

function formatShort(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function cellText(day) {
  if (day.status === "absent") return "—";
  const a = formatShort(day.clockInAt);
  const b = formatShort(day.clockOutAt);
  if (day.status === "in") return `${a} / …`;
  return `${a} / ${b}`;
}

export default function AdminAttendancePanel() {
  const [view, setView] = useState("student");
  const [weekOffset, setWeekOffset] = useState(0);
  const [matrix, setMatrix] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/attendance/admin/matrix", {
        params: { view, weekOffset },
        meta: { silent: true },
      });
      setMatrix(res.data);
    } catch {
      setMatrix(null);
    } finally {
      setLoading(false);
    }
  }, [view, weekOffset]);

  useEffect(() => {
    load();
  }, [load]);

  const weekDates = matrix?.weekDates || [];
  const rows = matrix?.rows || [];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className={ui.h1}>Attendance</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Review check-in and check-out times for the selected week (Monday–Sunday, India time). Switch between students
          and faculty to audit presence on campus.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setView("student")}
          className={cx(
            ui.btnBase,
            "flex-1 gap-2 sm:flex-none",
            view === "student" ? ui.btnPrimary : "text-slate-700 hover:bg-slate-50"
          )}
        >
          <Users className="h-4 w-4" aria-hidden />
          Students
        </button>
        <button
          type="button"
          onClick={() => setView("faculty")}
          className={cx(
            ui.btnBase,
            "flex-1 gap-2 sm:flex-none",
            view === "faculty" ? ui.btnPrimary : "text-slate-700 hover:bg-slate-50"
          )}
        >
          <GraduationCap className="h-4 w-4" aria-hidden />
          Faculty
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {matrix?.weekStart && matrix?.weekEnd ? (
            <p className="text-sm font-medium text-slate-800">
              Week: <span className="font-mono text-slate-600">{matrix.weekStart}</span>
              <span className="mx-1.5 text-slate-400">→</span>
              <span className="font-mono text-slate-600">{matrix.weekEnd}</span>
            </p>
          ) : null}
          <p className="mt-0.5 text-xs text-slate-500">
            Today (system):{" "}
            <span className="font-mono font-medium text-slate-700">{matrix?.todayWorkDate || "—"}</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-2")}
            aria-label="Previous week"
            onClick={() => setWeekOffset((o) => o - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={cx(ui.btnBase, ui.btnSoft, "px-3 py-2 text-sm")}
            disabled={weekOffset === 0}
            onClick={() => setWeekOffset(0)}
          >
            This week
          </button>
          <button
            type="button"
            className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-2")}
            aria-label="Next week"
            disabled={weekOffset >= 0}
            onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={ui.dashTable}>
            <thead className={ui.dashTableHead}>
              <tr>
                <th className={cx(ui.dashTableTh, "sticky left-0 z-10 bg-slate-50")}>Name</th>
                {weekDates.map((wd, i) => (
                  <th key={wd} className={ui.dashTableTh}>
                    <span className="block font-mono text-[10px] font-normal normal-case text-slate-400">{wd}</span>
                    <span className="block">{WEEKDAY_SHORT[i] || ""}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    No {view === "student" ? "students" : "faculty"} found, or could not load data.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.userId} className={ui.dashTableRow}>
                    <td className={cx(ui.dashTableTd, "sticky left-0 z-10 bg-white font-medium text-slate-900 shadow-[4px_0_12px_-8px_rgba(0,0,0,0.15)]")}>
                      <span className="block truncate max-w-[10rem] sm:max-w-[14rem]">{row.name}</span>
                      <span className="block truncate text-xs font-normal text-slate-500">{row.email}</span>
                    </td>
                    {row.days.map((day) => (
                      <td key={day.workDate} className={cx(ui.dashTableTd, "whitespace-nowrap text-xs")}>
                        <span
                          className={cx(
                            "mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle",
                            day.status === "complete" && "bg-emerald-500",
                            day.status === "in" && "bg-amber-500",
                            day.status === "absent" && "bg-slate-300"
                          )}
                          title={day.status}
                          aria-hidden
                        />
                        <span className="align-middle text-slate-700">{cellText(day)}</span>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-500">
          Legend: green = completed day (in &amp; out), amber = checked in only, gray = no record. Times are in / out.
        </p>
      </div>
    </div>
  );
}
