import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaTimes,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white pt-10 relative">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 pb-10 border-b border-gray-600">

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 inline-block">
            Contact Us
          </h3>

          <p className="flex items-center gap-2 mt-3">
            <FaPhoneAlt className="text-yellow-400" /> +91 1800 102 9191
          </p>

          <p className="flex items-center gap-2 mt-3">
            <FaEnvelope className="text-yellow-400" /> admission@svvv.edu.in
          </p>

          <p className="flex items-start gap-2 mt-3">
            <FaMapMarkerAlt className="text-yellow-400 mt-1" />
            Campus : Indore – Ujjain Road, Indore – 453111
          </p>

          <p className="flex items-start gap-2 mt-3">
            <FaMapMarkerAlt className="text-yellow-400 mt-1" />
            City Office : Shri Vaishnav Vidya Parisar, Indore
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 inline-block">
            Useful Links
          </h3>

          <ul className="space-y-2">
            <li>Research</li>
            <li>Library Remote Access</li>
            <li>News & Events</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Other Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 inline-block">
            Other Links
          </h3>

          <ul className="space-y-2">
            <li>Bus Route</li>
            <li>Placements</li>
            <li>Student Login</li>
            <li>Employee Login</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 inline-block">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li>Career</li>
            <li>Contact Us</li>
            <li>Refund Policy</li>
            <li>Library</li>
          </ul>
        </div>
      </div>

      {/* Top Bar (Logo + Title + Apply Button) */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        <div className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/6/6e/Shri_Vaishnav_Vidyapeeth_Vishwavidyalaya_logo.png"
            alt="logo"
            className="w-14"
          />
          <div>
            <h2 className="text-lg md:text-xl font-bold">
              Shri Vaishnav Vidyapeeth Vishwavidyalaya
            </h2>
            <p className="text-yellow-400 text-sm">
              Indore – Ujjain Road, Indore – 453111
            </p>
          </div>
        </div>

        {/* Apply Button */}
        <Link
          to="/admission"
          className="bg-yellow-500 text-black px-6 py-2 rounded font-semibold hover:scale-105 transition"
        >
          Apply Now
        </Link>
      </div>

      {/* Social Icons Left Side */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col z-50">
        <a className="bg-white p-2 border"><FaInstagram /></a>
        <a className="bg-white p-2 border"><FaFacebookF /></a>
        <a className="bg-white p-2 border"><FaLinkedinIn /></a>
        <a className="bg-white p-2 border"><FaYoutube /></a>
        <a className="bg-white p-2 border"><FaTimes /></a>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-950 text-center py-3 text-sm mt-6">
        © SVVV Indore | All rights reserved 2025
      </div>
    </footer>
  );
}