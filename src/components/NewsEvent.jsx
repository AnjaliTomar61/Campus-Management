import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx, ui } from "../lib/ui";

const newsData = [
  {
    id: 1,
    title: "A MoU Signing Ceremony on July …",
    image: "https://www.svvv.edu.in/assets/images/event/times-now.webp",
    link: "#",
  },
  {
    id: 2,
    title: "National Research Methodology Workshop",
    image: "https://www.svvv.edu.in/assets/images/event/8th-convocation.webp",
    link: "#",
  },
  {
    id: 3,
    title: "Aimed at raising awareness about …",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 4,
    title: "Campus innovation & hackathons",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 5,
    title: "Industry collaboration week",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 6,
    title: "Research showcase 2026",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 7,
    title: "Sports & cultural fest",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
];

export default function NewsEvents() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 4;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % newsData.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
  };

  const visibleItems = [];
  for (let i = 0; i < itemsPerView; i++) {
    visibleItems.push(newsData[(startIndex + i) % newsData.length]);
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className={ui.landingContainer}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className={ui.landingSectionTitle}>News &amp; events</h2>
            <div className={ui.landingSectionAccent} aria-hidden />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Highlights from campus, partnerships, and student achievements.
            </p>
          </div>

          <div className="flex shrink-0 gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous items"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-(--brand-blue) hover:text-(--brand-blue)"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next items"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-(--brand-blue) hover:text-(--brand-blue)"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.map((item) => (
            <article
              key={`${startIndex}-${item.id}`}
              className="flex flex-col overflow-hidden rounded-2xl bg-white brand-ring transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.15)]"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-slate-900 sm:text-[0.9375rem]">
                  {item.title}
                </h3>
                <a
                  href={item.link}
                  className="mt-auto border-t border-slate-100 pt-3 text-xs font-semibold uppercase tracking-wide text-(--brand-blue) hover:text-slate-900"
                >
                  Read more
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
