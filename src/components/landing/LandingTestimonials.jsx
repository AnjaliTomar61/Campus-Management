import { Quote } from "lucide-react";
import { cx, ui } from "../../lib/ui";

const quotes = [
  {
    quote:
      "The faculty pushed us beyond textbooks—labs and projects made interviews feel familiar instead of scary.",
    name: "Priya S.",
    role: "B.Tech graduate · placed in product engineering",
  },
  {
    quote:
      "From library hours to club events, the campus always felt alive. I found mentors in seniors and staff alike.",
    name: "Rahul M.",
    role: "MBA · student leadership",
  },
  {
    quote:
      "Research seminars and industry sessions helped me narrow my Ph.D. topic early. The support desk was genuinely helpful.",
    name: "Dr. Ananya K.",
    role: "Research scholar",
  },
];

export default function LandingTestimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-slate-200/80 bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className={cx(ui.landingContainer)}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Voices from campus</p>
          <h2 id="testimonials-heading" className={cx(ui.landingSectionTitle, "mt-2")}>
            What students & scholars say
          </h2>
          <div className={cx(ui.landingSectionAccent, "mx-auto")} />
        </div>

        <ul className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-3">
          {quotes.map(({ quote, name, role }) => (
            <li key={name}>
              <figure
                className={cx(
                  "flex h-full flex-col rounded-2xl border border-slate-200/90 bg-(--brand-bg) p-6 brand-ring sm:p-7"
                )}
              >
                <Quote className="h-9 w-9 text-amber-500/80" aria-hidden />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                  “{quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-slate-200/80 pt-4">
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{role}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
