import { Link } from "react-router-dom";
import { CalendarDays, MessageCircle } from "lucide-react";
import { cx, ui } from "../../lib/ui";

export default function LandingCTABand() {
  return (
    <section
      id="get-started"
      className="border-t border-amber-400/30 bg-linear-to-r from-(--brand-blue-2) via-(--brand-blue) to-[#1a3054] py-12 sm:py-14"
      aria-labelledby="cta-heading"
    >
      <div
        className={cx(
          ui.landingContainer,
          "flex flex-col items-center justify-between gap-8 text-center text-white lg:flex-row lg:text-left"
        )}
      >
        <div className="max-w-xl">
          <h2 id="cta-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to plan your campus journey?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
            Check admission timelines, explore institutes, or talk to the admissions team—we are here to help you take
            the next step.
          </p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center lg:w-auto lg:max-w-none lg:justify-end">
          <Link
            to="/admission"
            className={cx(
              ui.btnBase,
              "inline-flex min-h-11 items-center justify-center gap-2 bg-amber-400 px-6 text-slate-950 shadow-lg hover:bg-amber-300"
            )}
          >
            <CalendarDays className="h-5 w-5 shrink-0" aria-hidden />
            View admission
          </Link>
          <Link
            to="/contact"
            className={cx(
              ui.btnBase,
              "inline-flex min-h-11 items-center justify-center gap-2 border border-white/35 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
            )}
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
