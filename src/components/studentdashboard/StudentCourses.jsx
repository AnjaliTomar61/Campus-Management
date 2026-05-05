import { useCallback, useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function courseLabel(course) {
  if (!course) return "—";
  const name = course.courseName || "";
  const code = course.courseCode ? `(${course.courseCode})` : "";
  return [name, code].filter(Boolean).join(" ") || "—";
}

export default function StudentCourses() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/user/me/profile", {
        meta: { suppressErrorToast: true, silent: true },
      });
      setProfile(res.data?.profile || null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const course = profile?.course || null;
  const semester = profile?.currentSemester || null;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className={ui.h1}>My course</h1>
        <p className="mt-1 text-sm text-slate-600">
          Your academic program details pulled from the student profile assigned by admin.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={cx(ui.card, "p-5")}>
          <div className="flex items-center justify-between">
            <h2 className={ui.h2}>Program</h2>
            <BookOpen className="h-5 w-5 text-(--brand-blue)" aria-hidden />
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading…</p>
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Course" value={courseLabel(course)} />
              <Row label="Duration" value={course?.duration || "—"} />
              <Row label="Eligibility" value={course?.eligibility || "—"} />
              <Row label="Current semester" value={semester?.title || (semester?.number != null ? `Semester ${semester.number}` : "—")} />
              <Row label="Admission status" value={profile?.admissionStatus || "—"} />
            </dl>
          )}
        </div>

        <div className={cx(ui.card, "p-5")}>
          <h2 className={ui.h2}>Course notes</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>When the admin changes your course or semester on the student record, this page updates automatically.</p>
            <p>Your timetable and results use the same assigned semester to show live academic data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{value}</dd>
    </div>
  );
}

