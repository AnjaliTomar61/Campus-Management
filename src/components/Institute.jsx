import { useState } from "react";
import { Link } from "react-router-dom";

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
    let arr = [];
    for (let i = 0; i < visibleCards; i++) {
      arr.push(data[(index + i) % data.length]);
    }
    return arr;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold border-b-4 border-yellow-500 inline-block">
          Our Institutes
        </h2>

        <div className="flex gap-3">
          <button
            onClick={prevSlide}
            className="bg-yellow-500 px-4 py-2 rounded font-bold"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="bg-yellow-500 px-4 py-2 rounded font-bold"
          >
            →
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {getVisibleData().map((item, i) => (
          <div
            key={i}
            className="group bg-white shadow-lg rounded overflow-hidden transform transition hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={item.img}
                alt=""
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition"></div>

              {/* Read More Link */}
              <Link
                to={`/institute/${item.id}`}
                className="
                  absolute left-3 bottom-3
                  bg-yellow-500 text-black font-semibold
                  px-4 py-2 rounded shadow
                  opacity-0 translate-y-4
                  transition-all duration-300
                  group-hover:opacity-100 group-hover:translate-y-0
                "
              >
                Read More
              </Link>
            </div>

            {/* Title */}
            <div className="bg-blue-900 text-white text-center p-3">
              <h3 className="text-sm font-semibold">{item.title}</h3>
            </div>

            {/* Subtitle */}
            <div className="text-center p-2 text-gray-600 text-sm">
              {item.subtitle}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}