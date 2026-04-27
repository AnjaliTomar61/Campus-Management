import { useEffect, useRef, useState } from "react";
import { cx, ui } from "../lib/ui";

const CounterBox = ({ target, label, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const increment = target / 100;

    const interval = setInterval(() => {
      current += increment;

      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.ceil(current));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [start, target]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm sm:px-5 sm:py-6">
      <p className="text-3xl font-bold tabular-nums text-white sm:text-4xl md:text-5xl">
        {count}
        <span className="text-amber-300">+</span>
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-amber-200/95 sm:text-sm">
        {label}
      </p>
    </div>
  );
};

export default function StudySection() {
  const sectionRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const top = sectionRef.current.offsetTop;
      const height = window.innerHeight;

      if (window.scrollY > top - height + 120) {
        setStart(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[420px] w-full overflow-hidden bg-slate-900 sm:min-h-[440px] lg:min-h-[400px]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-br from-(--brand-blue-2)/92 via-(--brand-blue)/88 to-slate-950/90"
        aria-hidden
      />

      <div className={cx(ui.landingContainer, "relative z-10 flex min-h-[420px] flex-col justify-center gap-10 py-14 sm:min-h-[440px] sm:py-16 lg:min-h-[400px] lg:flex-row lg:items-center lg:gap-16 lg:py-20")}>
        <div className="max-w-xl lg:w-1/2">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/90">
            Why SVVV
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Study at SVVV
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
            Shri Vaishnav Vidyapeeth Trust works to improve quality of life through education,
            health, and environment—so graduates are ready for careers and community impact.
          </p>
        </div>

        <div className="grid w-full grid-cols-3 gap-2 sm:gap-4 lg:w-1/2 lg:max-w-xl">
          <CounterBox target={30} label="Programmes" start={start} />
          <CounterBox target={150} label="Achievements" start={start} />
          <CounterBox target={2000} label="Placements" start={start} />
        </div>
      </div>
    </section>
  );
}
