import { useEffect, useRef, useState } from "react";

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
    <div className="text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white">
        {count}+
      </h2>
      <p className="text-yellow-400 font-semibold mt-2">{label}</p>
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

      if (window.scrollY > top - height + 100) {
        setStart(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400px] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-950/80 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-center text-white">

          {/* Left Content */}
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              STUDY AT SVVV
            </h1>
            <p className="text-sm md:text-base leading-relaxed">
              Shri Vaishnav Vidyapeeth Trust believes in taking the nation forward
              by improving the quality of life of its citizens by continuously
              working in the sphere of education, health and environment.
            </p>
          </div>

          {/* Right Counters */}
          <div className="md:w-1/2 flex justify-around mt-6 md:mt-0 w-full">
            <CounterBox target={30} label="PROGRAMMES" start={start} />
            <CounterBox target={150} label="ACHIEVEMENTS" start={start} />
            <CounterBox target={2000} label="PLACEMENTS" start={start} />
          </div>
        </div>
      </div>
    </section>
  );
}