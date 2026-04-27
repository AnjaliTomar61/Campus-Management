import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx, ui } from "../lib/ui";

const data = [
  {
    id: "commerce",
    title: "Shri Vaishnav Institute of Commerce",
    subtitle: "Law, Management & Commerce",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    id: "social",
    title: "Shri Vaishnav Institute of Social Science",
    subtitle: "Social Sciences & Humanities",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: "journalism",
    title: "Shri Vaishnav Institute of Journalism",
    subtitle: "Media & Communication",
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
  },
  {
    id: "science",
    title: "Shri Vaishnav Institute of Science",
    subtitle: "Science & Applied Fields",
    img: "https://images.unsplash.com/photo-1581091012184-5c2d5d0e4c3b",
  },
  {
    id: "engineering",
    title: "Engineering Institute",
    subtitle: "Tech & Innovation",
    img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
  },
];

export default function Institutes() {
  const [index, setIndex] = useState(0);
  const visibleCards = 4;

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const getVisibleData = () => {
    const arr = [];
    for (let i = 0; i < visibleCards; i++) {
      arr.push(data[(index + i) % data.length]);
    }
    return arr;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className={ui.landingContainer}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className={ui.landingSectionTitle}>Our institutes</h2>
            <div className={ui.landingSectionAccent} aria-hidden />
            <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              Constituent institutes across disciplines—each with focused programmes and faculty.
            </p>
          </div>

          <div className="flex shrink-0 gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous institutes"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-800 transition hover:border-(--brand-blue) hover:bg-white hover:text-(--brand-blue)"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next institutes"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-800 transition hover:border-(--brand-blue) hover:bg-white hover:text-(--brand-blue)"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {getVisibleData().map((item) => (
            <article
              key={`${index}-${item.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white brand-ring transition hover:-translate-y-1 hover:shadow-[0_18px_45px_-22px_rgba(15,23,42,0.18)]"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={item.img}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-80 transition group-hover:opacity-100"
                  aria-hidden
                />

                <Link
                  to="/institutes"
                  className={cx(
                    ui.btnBase,
                    "absolute bottom-3 left-3 right-3 justify-center bg-amber-400 text-sm text-slate-950 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100 sm:left-4 sm:right-auto sm:px-5"
                  )}
                >
                  View institutes
                </Link>
              </div>

              <div className="bg-linear-to-r from-(--brand-blue-2) to-(--brand-blue) px-3 py-3 text-center">
                <h3 className="text-xs font-semibold leading-snug text-white sm:text-sm">{item.title}</h3>
              </div>

              <div className="px-3 py-3 text-center">
                <p className="text-xs text-slate-600 sm:text-sm">{item.subtitle}</p>
                <Link
                  to="/institutes"
                  className="mt-2 inline-block text-xs font-semibold text-(--brand-blue) hover:underline"
                >
                  All institutes →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
