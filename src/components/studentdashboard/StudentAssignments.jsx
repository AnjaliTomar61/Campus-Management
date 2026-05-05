import { useCallback, useEffect, useMemo, useState } from "react";
import { BookMarked, CalendarDays, UserRound } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

export default function StudentAssignments() {
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, ttRes] = await Promise.all([
        api.get("/api/v1/user/me/profile", { meta: { suppressErrorToast: true, silent: true } }).catch(() => ({ data: {} })),
        api.get("/api/timetable/me", { meta: { silent: true } }).catch(() => ({ data: {} })),
      ]);
      setProfile(profileRes.data?.profile || null);
      setSlots(Array.isArray(ttRes.data?.slots) ? ttRes.data.slots : []);
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
      if (s.subject?._id) ids.add(String(s.subject._id));
    });
    return ids.size;
  }, [slots]);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>Assignments overview</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live academic overview based on your current semester timetable and assigned faculty mentor.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={BookMarked} title="Subjects this term" value={loading ? "…" : String(subjectCount)} />
        <Stat icon={CalendarDays} title="Weekly classes" value={loading ? "…" : String(slots.length)} />
        <Stat
          icon={UserRound}
          title="Mentor assigned"
          value={loading ? "…" : profile?.assignedFaculty?.name || "No"}
        />
      </div>

      <div className={cx(ui.card, "p-5")}>
        <h2 className={ui.h2}>Status</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p>
            There is currently no separate backend assignment module in this project, so this page shows your live
            study-load summary instead of hardcoded dummy content.
          </p>
          <p>
            If you want, I can build a full assignment module next with admin/faculty create flow and student submission
            view.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, title, value }) {
  return (
    <div className={cx(ui.card, "p-5")}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-lg font-bold text-slate-900 wrap-break-word">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-(--brand-blue)" aria-hidden />
      </div>
    </div>
  );
}

