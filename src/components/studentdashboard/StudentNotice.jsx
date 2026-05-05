import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

export default function StudentNotice() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, ttRes, resultRes] = await Promise.all([
        api.get("/api/v1/user/me/profile", { meta: { suppressErrorToast: true, silent: true } }).catch(() => ({ data: {} })),
        api.get("/api/timetable/me", { meta: { silent: true } }).catch(() => ({ data: {} })),
        api.get("/api/results/me", { meta: { silent: true } }).catch(() => ({ data: {} })),
      ]);

      const profile = profileRes.data?.profile || null;
      const notices = [];

      if (!profile?.course || !profile?.currentSemester) {
        notices.push("Ask admin to assign your course and current semester to unlock timetable and result sections.");
      } else {
        notices.push(
          `Academic profile active for ${profile.course.courseName || "your course"} · Semester ${
            profile.currentSemester.number ?? "—"
          }.`
        );
      }

      const slotCount = Array.isArray(ttRes.data?.slots) ? ttRes.data.slots.length : 0;
      notices.push(
        slotCount
          ? `Your timetable currently has ${slotCount} scheduled class period(s).`
          : "No class periods are available in your timetable yet."
      );

      const resultCount = Array.isArray(resultRes.data?.results) ? resultRes.data.results.length : 0;
      notices.push(
        resultCount
          ? `${resultCount} published result sheet(s) are available in your Results tab.`
          : "No published result sheets are available yet."
      );

      if (profile?.assignedFaculty?.name) {
        notices.push(`Your faculty mentor is ${profile.assignedFaculty.name}.`);
      }

      setItems(notices);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>Academic notices</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live status notes generated from your current profile, timetable, and result data.
        </p>
      </div>

      <div className={cx(ui.card, "p-5")}>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-(--brand-blue)" aria-hidden />
          <h2 className={ui.h2}>Updates</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {loading ? (
            <li className="text-sm text-slate-500">Loading…</li>
          ) : (
            items.map((item, idx) => (
              <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                {item}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

