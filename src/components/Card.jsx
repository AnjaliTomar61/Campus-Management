import { useNavigate } from "react-router-dom";
import { Video, BookOpen, FileText } from "lucide-react";
import { cx, ui } from "../lib/ui";

export default function Card() {
  const navigate = useNavigate();

  const FeatureCard = ({ icon, title, description, buttonText, image, onClick }) => (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white brand-ring transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-18px_rgba(15,23,42,0.16)]">
      <div className="relative aspect-video shrink-0 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-transparent to-transparent opacity-80 transition group-hover:opacity-100"
          aria-hidden
        />
        <div className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/40 bg-white/95 text-(--brand-blue) shadow-md backdrop-blur-sm sm:left-4 sm:top-4">
          {icon}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 text-left sm:px-6 sm:pb-7 sm:pt-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        ) : null}

        <button
          type="button"
          onClick={onClick}
          className={cx(
            ui.btnBase,
            "mt-5 w-full min-h-10 bg-amber-400 text-sm text-slate-950 hover:bg-amber-300 sm:mt-6"
          )}
        >
          {buttonText}
        </button>
      </div>
    </article>
  );

  return (
    <section className="relative z-10 border-t border-slate-200/70 bg-(--brand-bg) py-10 sm:py-14 lg:py-16">
      <div className={cx(ui.landingContainer, "grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8")}>
        <FeatureCard
          icon={<Video className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />}
          title="360° campus view"
          description="See labs, libraries, and student life before you visit."
          buttonText="Explore now"
          onClick={() => navigate("/institutes")}
          image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
        />

        <FeatureCard
          icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />}
          title="Online admission 2026"
          description="Create your account and follow the guided admission steps."
          buttonText="Register now"
          onClick={() => navigate("/admission")}
          image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
        />

        <FeatureCard
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />}
          title="Admissions enquiry"
          description="Reach the admissions desk for eligibility and documents."
          buttonText="Enquire now"
          onClick={() => navigate("/contact")}
          image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
        />
      </div>
    </section>
  );
}
