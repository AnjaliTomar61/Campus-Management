import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function SVVVSection() {
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef(null);

  const notices = [
    "Revised Fee Submission Notice for 1st Year (Jan–June 2026)",
    "Revised Fee Submission Notice (Jan–June 2026)",
    "Qualifying Criteria for PhD Entrance Examination 2025",
    "Access to National Digital Library",
    "Shri Tarkeshwar Singh (Retired Principal District Judge)",
    "Exam Notice - Ph.D Course Work Center and Timings",
  ];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // ✅ Start from TOP
    container.scrollTop = 0;

    const interval = setInterval(() => {
      if (!paused) {
        container.scrollTop += 1; // move DOWN (top → bottom)

        // ✅ When reached bottom → reset to top
        if (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight
        ) {
          container.scrollTop = 0;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* LEFT SECTION */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 border-b-4 border-yellow-500 inline-block pb-2">
            Welcome to SVVV Indore
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            1884 is the landmark year as the foundation stone was laid 142 years ago.
          </p>

          <Link to="/about">
            <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 shadow-md">
              READ MORE
            </button>
          </Link>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white text-center py-3 font-semibold">
            LATEST UPDATE
          </div>

          <div
            ref={scrollRef}
            className="h-52 sm:h-64 md:h-72 overflow-hidden px-4 sm:px-6 py-3 sm:py-4 space-y-4"
          >
            {[...notices, ...notices, ...notices].map((notice, i) => (
              <div
                key={i}
                onMouseEnter={() => setPaused(true)}  // ✅ pause on hover
                onMouseLeave={() => setPaused(false)} // ✅ resume
                onClick={() => setPaused(true)}       // ✅ stop on click
                className="group flex items-start gap-3 text-blue-900 cursor-pointer"
              >
                {/* dot */}
                <span className="mt-2 h-2 w-2 bg-yellow-500 rounded-full"></span>

                {/* text */}
                <p className="text-sm sm:text-base group-hover:text-blue-600 transition">
                  {notice}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}