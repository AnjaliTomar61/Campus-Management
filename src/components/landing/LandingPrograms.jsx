import { Link } from "react-router-dom";
import { ArrowRight, BookMarked, Cpu, Microscope } from "lucide-react";
import { cx, ui } from "../../lib/ui";

const tracks = [
  {
    icon: BookMarked,
    title: "Undergraduate",
    blurb: "B.Tech, B.Pharm, B.Sc & integrated pathways with strong fundamentals.",
    to: "/admission",
    tag: "UG 2026",
  },
  {
    icon: Cpu,
    title: "Postgraduate",
    blurb: "M.Tech, MBA, MCA & specialised programmes with research exposure.",
    to: "/admission",
    tag: "PG",
  },
  {
    icon: Microscope,
    title: "Research & Ph.D.",
    blurb: "Scholar communities, funded projects, and publication support.",
    to: "/institutes",
    tag: "R&D",
  },
];

export default function LandingPrograms() {
  return (
    <section
      id="programs"
      className="border-t border-slate-200/80 bg-linear-to-b from-slate-900 via-[#1a2744] to-slate-900 py-12 text-white sm:py-16 lg:py-20"
      aria-labelledby="programs-heading"
    >
      <div className={cx(ui.landingContainer)}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90">Academic tracks</p>
            <h2 id="programs-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Find your programme
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Explore pathways that match your goals—then continue to admission or institute pages for details and
              eligibility.
            </p>
          </div>
          <Link
            to="/admission"
            className={cx(
              ui.btnBase,
              "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start border border-white/25 bg-white/10 px-5 text-white backdrop-blur-sm hover:bg-white/20 lg:self-auto"
            )}
          >
            Start application
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {tracks.map(({ icon: Icon, title, blurb, to, tag }) => (
            <li key={title}>
              <Link
                to={to}
                className={cx(
                  "group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition",
                  "hover:border-amber-400/35 hover:bg-white/[0.07]"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
                    {tag}
                  </span>
                  <Icon className="h-5 w-5 text-amber-300/90" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-300 group-hover:gap-2">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
