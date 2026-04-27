import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx, ui } from "../lib/ui";

import img1 from "../assets/hero-section4.jpg";
import img2 from "../assets/hero-section2.jpg";
import img3 from "../assets/hero-section4.jpg";

const SLIDE_MS = 6000;

export default function HeroSection() {
  const images = [img1, img2, img3];
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, SLIDE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion, images.length]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  return (
    <div className="relative isolate min-h-[min(88vh,720px)] w-full sm:min-h-[520px] lg:min-h-[580px]">
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={i === current ? "SVVV campus" : ""}
          aria-hidden={i !== current}
          className={cx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
            i === current ? "z-1 opacity-100" : "z-0 opacity-0"
          )}
        />
      ))}

      {/* Scrim: darker at bottom (behind copy), still readable at top */}
      <div className="absolute inset-0 bg-slate-950/80" aria-hidden />
      <div
        className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/80 to-slate-950/55"
        aria-hidden
      />

      <div
        className={cx(
          ui.landingContainer,
          "relative z-10 flex h-full min-h-[inherit] flex-col justify-end pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
        )}
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/95">
            Shri Vaishnav Vidyapeeth Vishwavidyalaya
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Learn, research, and grow on campus
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-200 sm:text-lg">
            A NAAC-focused ecosystem with strong industry connect, modern labs, and
            support from the Shri Vaishnav Vidyapeeth Trust legacy.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/admission"
              className={cx(
                ui.btnBase,
                "inline-flex min-h-11 justify-center bg-amber-400 px-6 text-slate-950 shadow-lg hover:bg-amber-300"
              )}
            >
              Admission 2026
            </Link>
            <Link
              to="/institutes"
              className={cx(
                ui.btnBase,
                "inline-flex min-h-11 justify-center border border-white/35 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
              )}
            >
              Explore institutes
            </Link>
            <Link
              to="/about"
              className="text-center text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline sm:text-left"
            >
              About SVVV
            </Link>
          </div>

          <div className="mt-8 flex gap-2" role="tablist" aria-label="Hero slides">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={cx(
                  "h-2 rounded-full transition-all",
                  i === current ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/85 p-2.5 text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white sm:left-5"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/85 p-2.5 text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white sm:right-5"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
