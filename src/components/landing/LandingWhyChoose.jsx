import { GraduationCap, Building2, FlaskConical, Handshake } from "lucide-react";
import { cx, ui } from "../../lib/ui";

const pillars = [
  {
    icon: GraduationCap,
    title: "Outcome-focused learning",
    text: "Curricula aligned with industry skills, internships, and placement readiness from day one.",
  },
  {
    icon: Building2,
    title: "Modern campus & labs",
    text: "Libraries, computing labs, and workshops designed for hands-on engineering and sciences.",
  },
  {
    icon: FlaskConical,
    title: "Research & innovation",
    text: "Faculty-led projects, incubation support, and participation in national competitions.",
  },
  {
    icon: Handshake,
    title: "Industry & alumni connect",
    text: "Mentorships, guest lectures, and a growing network of recruiters and alumni leaders.",
  },
];

export default function LandingWhyChoose() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden border-t border-slate-200/80 bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="why-us-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-(--brand-blue)/8 blur-3xl"
        aria-hidden
      />

      <div className={cx(ui.landingContainer, "relative")}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Why SVVV</p>
          <h2 id="why-us-heading" className={cx(ui.landingSectionTitle, "mt-2")}>
            Built for serious students
          </h2>
          <div className={cx(ui.landingSectionAccent, "mx-auto")} />
          <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
            Whether you are joining UG, PG, or research programmes, you get structure, mentorship, and a campus
            culture that rewards curiosity.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {pillars.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <article
                className={cx(
                  "group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-(--brand-bg) p-6 shadow-sm transition",
                  "hover:border-amber-200/80 hover:shadow-md"
                )}
              >
                <div
                  className={cx(
                    "flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white",
                    "text-(--brand-blue) transition group-hover:border-amber-300/60 group-hover:bg-amber-50"
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{text}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
