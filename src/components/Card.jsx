import React from "react";
import { Video, BookOpen, FileText } from "lucide-react";

const Card = () => {

  const FeatureCard = ({ icon, title, buttonText, image }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center relative hover:shadow-2xl transition duration-300">
        
        {/* Floating Icon */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border">
            {icon}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {title}
          </h2>

          <button className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-md font-medium">
            {buttonText}
          </button>

          <div className="mt-4 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-44 object-cover hover:scale-105 transition duration-300"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative -mt-40 z-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        <FeatureCard
          icon={<Video size={24} className="text-yellow-500" />}
          title="360° View"
          buttonText="Explore Now"
          image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
        />

        <FeatureCard
          icon={<BookOpen size={24} className="text-yellow-500" />}
          title="Online Admission 2026"
          buttonText="Register Now"
          image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
        />

        <FeatureCard
          icon={<FileText size={24} className="text-yellow-500" />}
          title="Admissions Enquiry"
          buttonText="Enquire Now!"
          image="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
        />

      </div>
    </section>
  );
};

export default Card;