import { useCallback, useEffect, useState } from "react";
import { CalendarRange } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

const DAY_LABEL = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function sortSlots(slots) {
  const list = Array.isArray(slots) ? [...slots] : [];
  return list.sort((a, b) => {
    const da = ORDER.indexOf(String(a.day || "").toLowerCase());
    const db = ORDER.indexOf(String(b.day || "").toLowerCase());
    if (da !== db) return (da === -1 ? 99 : da) - (db === -1 ? 99 : db);
    return String(a.startTime || "").localeCompare(String(b.startTime || ""));
  });
}

/**
 * Student: full class timetable for the semester on your profile.
 * Faculty: only periods for subjects assigned to you.
 */
export default function TimetableView({ variant = "student" }) {
  const [slots, setSlots] = useState([]);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/timetable/me", { meta: { silent: true } });
      setSlots(sortSlots(res.data?.slots || []));
      setHint(res.data?.hint || "");
    } catch {
      setSlots([]);
      setHint("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const title = variant === "faculty" ? "My teaching timetable" : "Class timetable";
  const subtitle =
    variant === "faculty"
      ? "Sessions pulled from the master timetable for subjects where you are listed as faculty."
      : "Your cohort’s weekly schedule for the semester currently set on your profile.";

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      {hint ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">{hint}</div>
      ) : null}

      <div className={cx(ui.dashTableCard)}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <CalendarRange className="h-5 w-5 text-(--brand-blue)" aria-hidden />
          <span className="text-sm font-semibold text-slate-800">Weekly schedule</span>
        </div>
        <div className={ui.dashTableScroller}>
          <table className={ui.dashTable}>
            <thead className={ui.dashTableHead}>
              <tr>
                <th className={ui.dashTableTh}>Day</th>
                <th className={ui.dashTableTh}>Time</th>
                <th className={ui.dashTableTh}>Subject</th>
                <th className={ui.dashTableTh}>Faculty</th>
                <th className={ui.dashTableTh}>Room</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    Loading…
                  </td>
                </tr>
              ) : slots.length === 0 ? (
                <tr>
                  <td colSpan={5} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                    No timetable entries yet.
                  </td>
                </tr>
              ) : (
                slots.map((s) => (
                  <tr key={s._id} className={ui.dashTableRow}>
                    <td className={ui.dashTableTd}>{DAY_LABEL[String(s.day || "").toLowerCase()] || s.day}</td>
                    <td className={cx(ui.dashTableTd, "whitespace-nowrap font-mono text-xs")}>
                      {s.startTime} – {s.endTime}
                    </td>
                    <td className={ui.dashTableTd}>
                      <span className="font-medium text-slate-900">{s.subject?.name || "—"}</span>
                      {s.subject?.code ? (
                        <span className="ml-1 text-xs text-slate-500">({s.subject.code})</span>
                      ) : null}
                    </td>
                    <td className={ui.dashTableTd}>{s.subject?.faculty?.name || "—"}</td>
                    <td className={ui.dashTableTd}>{s.room || "—"}</td>
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
