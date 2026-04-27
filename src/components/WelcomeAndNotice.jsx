import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cx, ui } from "../lib/ui";

const notices = [
  "Revised Fee Submission Notice for 1st Year (Jan–June 2026)",
  "Revised Fee Submission Notice (Jan–June 2026)",
  "Qualifying Criteria for PhD Entrance Examination 2025",
  "Access to National Digital Library",
  "Shri Tarkeshwar Singh (Retired Principal District Judge)",
  "Exam Notice - Ph.D Course Work Center and Timings",
];

export default function WelcomeAndNotice() {
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTop = 0;

    const interval = setInterval(() => {
      if (!paused) {
        container.scrollTop += 1;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className={cx(ui.landingContainer, "grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14")}>
        <div className="max-w-xl">
          <h2 className={ui.landingSectionTitle}>Welcome to SVVV Indore</h2>
          <div className={ui.landingSectionAccent} aria-hidden />
          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-[1.05rem]">
            1884 marks a landmark year—the foundation was laid more than a century ago. Today,
            SVVV blends heritage with modern programmes, research, and industry-aligned learning
            on the Indore–Ujjain corridor.
          </p>
          <Link
            to="/about"
            className={cx(
              ui.btnBase,
              "mt-8 inline-flex min-h-11 w-fit bg-amber-400 px-6 text-slate-950 hover:bg-amber-300"
            )}
          >
            Read more
          </Link>
        </div>

        <aside className="overflow-hidden rounded-2xl bg-white brand-ring">
          <div className="bg-linear-to-r from-(--brand-blue-2) to-(--brand-blue) px-4 py-3.5 text-center text-sm font-semibold tracking-wide text-white sm:text-base">
            Latest updates
          </div>

          <div
            ref={scrollRef}
            className="h-52 space-y-4 overflow-y-auto scroll-smooth px-4 py-4 sm:h-60 sm:px-5 sm:py-5 md:h-72 [scrollbar-width:thin] [scrollbar-color:rgba(39,68,114,0.35)_transparent]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {[...notices, ...notices, ...notices].map((notice, i) => (
              <div
                key={i}
                onClick={() => setPaused(true)}
                className="group flex cursor-pointer items-start gap-3 rounded-lg px-1 py-0.5 transition hover:bg-slate-50"
              >
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--brand-accent)"
                  aria-hidden
                />
                <p className="text-sm leading-snug text-slate-800 group-hover:text-(--brand-blue) sm:text-base">
                  {notice}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
