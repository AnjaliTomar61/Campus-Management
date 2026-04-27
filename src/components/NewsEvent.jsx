import { useState } from "react";

const newsData = [
  {
    id: 1,
    title: "A MoU Signing Ceremony on July ...",
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
    title: "Aimed at raising awareness about ...",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 4,
    title: "Another Event Example",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 5,
    title: "Another Event Example",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 6,
    title: "Another Event Example",
    image: "https://www.svvv.edu.in/assets/images/event/VOID-HACKS.webp",
    link: "#",
  },
  {
    id: 7,
    title: "Another Event Example",
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
    setStartIndex((prev) =>
      prev === 0 ? newsData.length - 1 : prev - 1
    );
  };

  const visibleItems = [];
  for (let i = 0; i < itemsPerView; i++) {
    visibleItems.push(newsData[(startIndex + i) % newsData.length]);
  }

  return (
    <div className="p-8 bg-gray-100 w-full">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-blue-900 border-b-4 border-yellow-500 inline-block mb-6">
        News & Events
      </h2>

      {/* Cards (Grid full width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md w-full"
          >
            <img
              src={item.image}
              alt={item.title}
              className="rounded-t-xl w-full h-[180px] object-contain"
            />

            <div className="p-4">
              <h3 className="text-gray-800 font-medium text-sm mb-4">
                {item.title}
              </h3>

              <a
                href={item.link}
                className="text-xs font-semibold text-gray-700 border-t pt-3 block hover:text-yellow-600"
              >
                READ MORE
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-600"
        >
          ←
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-600"
        >
          →
        </button>
      </div>
    </div>
  );
}