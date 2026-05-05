import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Users, CalendarDays } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

export default function FacultyAssignments() {
  const [slots, setSlots] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ttRes, stRes] = await Promise.all([
        api.get("/api/timetable/me", { meta: { silent: true } }).catch(() => ({ data: {} })),
        api.get("/api/v1/user/faculty/assigned-students", { meta: { silent: true } }).catch(() => ({ data: {} })),
      ]);
      setSlots(Array.isArray(ttRes.data?.slots) ? ttRes.data.slots : []);
      setStudents(Array.isArray(stRes.data?.students) ? stRes.data.students : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const subjectCount = useMemo(() => {
    const ids = new Set();
    slots.forEach((s) => {
      if (s.subject && s.subject._id) ids.add(String(s.subject._id));
    });
    return ids.size;
  }, [slots]);

  const weeklySlots = slots.length;
  const menteeCount = students.length;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>Assignments & workload</h1>
        <p className="mt-1 text-sm text-slate-600">
          High level picture of subjects, timetable load, and assigned mentees. Admin updates to subjects, timetable, or
          student mentoring will update these numbers automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={FileText}
          title="Teaching subjects"
          value={loading ? "…" : String(subjectCount)}
          caption="Unique subjects linked to you in the timetable"
        />
        <Stat
          icon={CalendarDays}
          title="Weekly periods"
          value={loading ? "…" : String(weeklySlots)}
          caption="Slots across all days where you appear as faculty"
        />
        <Stat
          icon={Users}
          title="Assigned mentees"
          value={loading ? "…" : String(menteeCount)}
          caption="Students where you are set as assigned faculty"
        />
      </div>

      <div className={cx(ui.card, "p-5")}>
        <h2 className={ui.h2}>How to use this</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Use the numbers above to balance classes, advising load, and result work with your administrator.</li>
          <li>
            To see individual students and update their academic details, open{" "}
            <span className="font-semibold text-(--brand-blue)">Assigned students</span>.
          </li>
          <li>
            To see exact teaching timings and rooms, open{" "}
            <span className="font-semibold text-(--brand-blue)">Timetable</span>.
          </li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, title, value, caption }) {
  return (
    <div className={cx(ui.card, "p-4 sm:p-5")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {caption ? <p className="mt-1 text-xs text-slate-500">{caption}</p> : null}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5">
          <Icon className="h-5 w-5 text-(--brand-blue)" aria-hidden />
        </span>
      </div>
    </div>
  );
}

