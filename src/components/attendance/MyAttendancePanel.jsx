import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, LogIn, LogOut } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

const TZ = "Asia/Kolkata";

function formatIstTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatIstClock(d) {
  return d.toLocaleTimeString("en-IN", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatIstDateLong(d) {
  return d.toLocaleDateString("en-IN", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusLabel(s) {
  if (s === "complete") return "Present";
  if (s === "in") return "On campus";
  return "No record";
}

function statusPillClass(s) {
  if (s === "complete") return "bg-emerald-100 text-emerald-800";
  if (s === "in") return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-600";
}

/**
 * Daily tap-in / tap-out and Mon–Sun week strip (week starts Monday, IST).
 */
export default function MyAttendancePanel({ heading = "Attendance" }) {
  const [now, setNow] = useState(() => new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekData, setWeekData] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [todayWorkDate, setTodayWorkDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tapBusy, setTapBusy] = useState(false);
  const [inlineMsg, setInlineMsg] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadWeek = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/attendance/me/week", {
        params: { weekOffset },
        meta: { silent: true },
      });
      setWeekData(res.data);
    } catch {
      setWeekData(null);
    } finally {
      setLoading(false);
    }
  }, [weekOffset]);

  const loadToday = useCallback(async () => {
    try {
      const res = await api.get("/api/attendance/me/today", { meta: { silent: true } });
      setTodaySummary(res.data?.summary || null);
      setTodayWorkDate(res.data?.workDate || null);
    } catch {
      setTodaySummary(null);
      setTodayWorkDate(null);
    }
  }, []);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  const refreshAll = async () => {
    await Promise.all([loadWeek(), loadToday()]);
  };

  const doTap = async (action) => {
    setInlineMsg(null);
    setTapBusy(true);
    try {
      await api.post(
        "/api/attendance/tap",
        { action },
        { meta: { suppressErrorToast: true, silent: true } }
      );
      setInlineMsg({ type: "ok", text: action === "in" ? "Checked in." : "Checked out." });
      await refreshAll();
    } catch (e) {
      setInlineMsg({ type: "err", text: e?.message || "Could not update attendance." });
    } finally {
      setTapBusy(false);
    }
  };

  const canCheckIn = todaySummary?.status === "absent";
  const canCheckOut = todaySummary?.status === "in";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div>
        <h1 className={ui.h1}>{heading}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tap when you arrive and when you leave. Your week runs Monday–Sunday (India time).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cx(ui.card, "p-5 sm:p-6")}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-5 w-5 shrink-0 text-(--brand-blue)" aria-hidden />
              <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Live clock</span>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {TZ.replace("_", " ")}
            </span>
          </div>
          <p className="mt-4 font-mono text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {formatIstClock(now)}
          </p>
          <p className="mt-1 text-sm text-slate-600">{formatIstDateLong(now)}</p>
          {todayWorkDate ? (
            <p className="mt-3 text-xs text-slate-500">
              Attendance day in system: <span className="font-mono font-medium">{todayWorkDate}</span>
            </p>
          ) : null}
        </div>

        <div className={cx(ui.card, "p-5 sm:p-6")}>
          <h2 className={ui.h2}>Today</h2>
          <p className="mt-1 text-sm text-slate-600">Record one check-in and one check-out per calendar day.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={cx("rounded-full px-3 py-1 text-xs font-semibold", statusPillClass(todaySummary?.status))}>
              {statusLabel(todaySummary?.status)}
            </span>
            {todaySummary?.clockInAt ? (
              <span className="text-sm text-slate-700">
                In <span className="font-medium">{formatIstTime(todaySummary.clockInAt)}</span>
              </span>
            ) : null}
            {todaySummary?.clockOutAt ? (
              <span className="text-sm text-slate-700">
                Out <span className="font-medium">{formatIstTime(todaySummary.clockOutAt)}</span>
              </span>
            ) : null}
          </div>
          {inlineMsg ? (
            <p
              className={cx(
                "mt-3 rounded-xl px-3 py-2 text-sm",
                inlineMsg.type === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"
              )}
            >
              {inlineMsg.text}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!canCheckIn || tapBusy}
              onClick={() => doTap("in")}
              className={cx(ui.btnBase, ui.btnPrimary, "min-w-[8.5rem]")}
            >
              <LogIn className="h-4 w-4" aria-hidden />
              Check in
            </button>
            <button
              type="button"
              disabled={!canCheckOut || tapBusy}
              onClick={() => doTap("out")}
              className={cx(ui.btnBase, ui.btnSoft, "min-w-[8.5rem]")}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Check out
            </button>
          </div>
        </div>
      </div>

      <div className={cx(ui.card, "p-5 sm:p-6")}>
        <div className={ui.cardHeader}>
          <div>
            <h2 className={ui.h2}>This week (Mon → Sun)</h2>
            {weekData?.weekStart && weekData?.weekEnd ? (
              <p className="mt-1 text-sm text-slate-600">
                {weekData.weekStart} → {weekData.weekEnd}
              </p>
            ) : null}
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

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading week…</p>
        ) : !weekData?.days?.length ? (
          <p className="mt-6 text-sm text-slate-500">Could not load attendance. Please try again later.</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weekData.days.map((d) => (
              <div
                key={d.workDate}
                className={cx(
                  "rounded-xl border p-3 text-center transition",
                  d.isToday ? "border-(--brand-blue)/40 bg-(--brand-blue)/5 ring-1 ring-(--brand-blue)/20" : "border-slate-200 bg-slate-50/80"
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{d.dayLabel}</p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400">{d.workDate}</p>
                <span
                  className={cx(
                    "mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    statusPillClass(d.status)
                  )}
                >
                  {statusLabel(d.status)}
                </span>
                <p className="mt-2 text-[11px] leading-snug text-slate-600">
                  {d.clockInAt ? <>In {formatIstTime(d.clockInAt)}</> : <>In —</>}
                  <br />
                  {d.clockOutAt ? <>Out {formatIstTime(d.clockOutAt)}</> : <>Out —</>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
