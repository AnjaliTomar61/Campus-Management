import { useNavigate } from "react-router-dom";
import { Video, BookOpen, FileText, ArrowRight } from "lucide-react";
import { cx, ui } from "../lib/ui";

export default function Card() {
  const navigate = useNavigate();

  const FeatureCard = ({ icon, title, description, buttonText, image, onClick }) => (
    <article
      className={cx(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
        "shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_40px_-12px_rgba(15,23,42,0.08)]",
        "transition duration-300 ease-out",
        "hover:-translate-y-1 hover:border-amber-200/70 hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.12),0_20px_50px_-16px_rgba(251,146,60,0.12)]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-linear-to-r from-(--brand-blue) via-amber-400 to-(--brand-blue) opacity-90"
        aria-hidden
      />

      <div className="relative aspect-16/10 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-900/20 to-transparent opacity-90 transition duration-300 group-hover:from-slate-950/85"
          aria-hidden
        />
        <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/95 text-(--brand-blue) shadow-lg backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:border-amber-300/60 group-hover:shadow-xl sm:left-5 sm:top-5">
          {icon}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-6 pt-5 text-left sm:px-6 sm:pb-7 sm:pt-6">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
        {description ? (
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">{description}</p>
        ) : null}

        <button
          type="button"
          onClick={onClick}
          className={cx(
            ui.btnBase,
            "mt-auto w-full min-h-11 justify-center gap-2 border border-amber-400/50 bg-linear-to-r from-amber-400 to-amber-300 text-sm font-semibold text-slate-950 shadow-sm",
            "transition hover:from-amber-300 hover:to-amber-200 hover:shadow-md active:scale-[0.99] sm:mt-6"
          )}
        >
          {buttonText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
    </article>
  );

  return (
    <section
      className="relative z-10 border-t border-slate-200/80 bg-linear-to-b from-(--brand-bg) via-white to-(--brand-bg) py-12 sm:py-16 lg:py-20"
      aria-labelledby="quick-cards-heading"
    >
      <div className={cx(ui.landingContainer)}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Explore campus</p>
          <h2 id="quick-cards-heading" className={cx(ui.landingSectionTitle, "mt-2")}>
            Start in a few clicks
          </h2>
          <div className={cx(ui.landingSectionAccent, "mx-auto")} />
          <p className="mt-4 text-pretty text-sm text-slate-600 sm:text-base">
            Tour the campus virtually, begin admission, or reach the admissions team—each path opens below.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          <FeatureCard
            icon={<Video className="h-6 w-6" aria-hidden />}
            title="360° campus view"
            description="See labs, libraries, and student life before you visit."
            buttonText="Explore now"
            onClick={() => navigate("/institutes")}
            image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
          />

          <FeatureCard
            icon={<BookOpen className="h-6 w-6" aria-hidden />}
            title="Online admission 2026"
            description="Create your account and follow the guided admission steps."
            buttonText="Register now"
            onClick={() => navigate("/admission")}
            image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
          />

          <FeatureCard
            icon={<FileText className="h-6 w-6" aria-hidden />}
            title="Admissions enquiry"
            description="Reach the admissions desk for eligibility and documents."
            buttonText="Enquire now"
            onClick={() => navigate("/contact")}
            image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
          />
        </div>
      </div>
    </section>
  );
}
