import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [subMenu, setSubMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setSubMenu(null);
  };

  const scrollToId = async (id) => {
    setOpenMenu(null);
    setMobileOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      // allow route to render
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return;
    }

    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1f355e] text-white text-sm px-4 md:px-6 py-2 flex justify-between items-center overflow-visible">
        
        {/* Hide on mobile */}
        <div className="hidden md:flex gap-6">
          <span>📞 1800 102 9191</span>
          <span>✉ admission@svvv.edu.in</span>
        </div>

        <div
          className="flex gap-2 md:gap-4 items-center relative overflow-visible"
          onClick={(e) => e.stopPropagation()}
        >
          {["Placement", "Alumni", "Library", "ARIIA"].map((item) => (
            <button
              key={item}
              className="hidden md:block bg-[#2e4a7f] px-3 py-1 rounded text-sm hover:bg-yellow-400 hover:text-black transition"
            >
              {item}
            </button>
          ))}

          {/* ERP Login Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("erp")}
              className="bg-[#2e4a7f] px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-400 hover:text-black transition"
            >
              ERP Login <ChevronDown size={14} />
            </button>

            {openMenu === "erp" && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black shadow-lg rounded border z-9999">
                <button
                  type="button"
                  onClick={() => navigate("/login?role=student")}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100"
                >
                  Student Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/login?role=faculty")}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100"
                >
                  Faculty Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/login?role=admin")}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100"
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-[#274472] text-white shadow-md overflow-visible">
        <div className="flex items-center justify-even px-4 md:px-6 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://svvv.edu.in/images/logo.png"
              alt="logo"
              className="w-14 md:w-16"
            />
            <span className="hidden lg:block font-semibold tracking-wide">
              Smart Campus
            </span>
          </Link>

          {/* Desktop Menu (UNCHANGED) */}
          <ul
            className="hidden md:flex gap-8 text-[15px] font-medium relative"
            onClick={(e) => e.stopPropagation()}
          >

            {/* About Menu */}
            <li className="relative">
              <button
                onClick={() => toggleMenu("about")}
                className="flex items-center gap-1 hover:text-yellow-400"
              >
                About <ChevronDown size={16} />
              </button>

              {openMenu === "about" && (
                <div className="absolute top-10 left-0 w-64 bg-white text-black shadow-lg rounded z-9999">

                  <button
                    type="button"
                    onClick={() => scrollToId("about")}
                    className="w-full text-left block px-4 py-2 hover:bg-gray-100"
                  >
                    About University
                  </button>

                  <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
                    Vision & Mission
                  </Link>

                  {/* Submenu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setSubMenu("desk")}
                    onMouseLeave={() => setSubMenu(null)}
                  >
                    <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      From the Desk of <ChevronRight size={14} />
                    </div>

                    {subMenu === "desk" && (
                      <div className="absolute left-full top-0 w-52 bg-white shadow-lg z-9999">
                        <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
                          Chancellor
                        </Link>
                        <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
                          Vice Chancellor
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
                    Approval & Affiliation
                  </Link>
                  <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
                    Annual Report
                  </Link>
                  <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
                    Administration
                  </Link>

                </div>
              )}
            </li>
            <li className="relative">
  <button
    onClick={() => toggleMenu("why")}
    className="flex items-center gap-1 hover:text-yellow-400"
  >
    Why SVVV <ChevronDown size={16} />
  </button>

  {openMenu === "why" && (
    <div className="absolute left-0 top-10 w-[900px] bg-gray-100 text-black shadow-xl rounded p-6 z-9999">

      <div className="grid grid-cols-4 gap-6">

        {/* Column 1 */}
        <div>
          <h3 className="font-semibold border-b-2 border-yellow-500 inline-block mb-3">
            Infrastructure
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">Hostel Facility</li>
            <li className="hover:text-blue-600 cursor-pointer">Auditorium</li>
            <li className="hover:text-blue-600 cursor-pointer">Transportation</li>
            <li className="hover:text-blue-600 cursor-pointer">Medical Center</li>
            <li className="hover:text-blue-600 cursor-pointer">Internet</li>
            <li className="hover:text-blue-600 cursor-pointer">Cafeteria</li>
            <li className="hover:text-blue-600 cursor-pointer">Site Plan</li>
            <li className="hover:text-blue-600 cursor-pointer">Sports</li>

            <h4 className="font-semibold mt-4 border-b-2 border-yellow-500 inline-block">
              Achievements
            </h4>
            <li className="hover:text-blue-600 cursor-pointer">
              Padma Awardees Visited to SVVV
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold border-b-2 border-yellow-500 inline-block mb-3">
            Centre Of Excellence
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">Plasma Research</li>
            <li className="hover:text-blue-600 cursor-pointer">Happiness Studies</li>
            <li className="hover:text-blue-600 cursor-pointer">Vocational Studies</li>
            <li className="hover:text-blue-600 cursor-pointer">Sustainable Development</li>
            <li className="hover:text-blue-600 cursor-pointer">Data Science</li>

            <h4 className="font-semibold mt-4 border-b-2 border-yellow-500 inline-block">
              Entrepreneur
            </h4>
            <li className="hover:text-blue-600 cursor-pointer">About</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact</li>
            <li className="hover:text-blue-600 cursor-pointer">Faculty Member</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold border-b-2 border-yellow-500 inline-block mb-3">
            Library
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">Library OPAC</li>
            <li className="hover:text-blue-600 cursor-pointer">About Library</li>

            <h4 className="font-semibold mt-4 border-b-2 border-yellow-500 inline-block">
              MOUS
            </h4>
            <li className="hover:text-blue-600 cursor-pointer">
              SVVV, Indore and IBM
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              SVVV and HU, Seoul
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              SVVV and St. Cloud State Uni
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              SVVV and NRDC
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              SVVV and Mitsubishi Electric India
            </li>
          </ul>
        </div>

        {/* Column 4 (Image) */}
        <div>
          <img
            src="/your-image.jpg"
            alt="campus"
            className="w-full h-full object-cover rounded"
          />
        </div>

      </div>
    </div>
  )}
</li>
  <li className="relative w-full md:w-auto">
      
      {/* Button */}
      <button
        onClick={() => toggleMenu("institute")}
        className="flex items-center justify-between w-full md:w-auto gap-1 hover:text-yellow-400"
      >
        Our Institute <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {openMenu === "institute" && (
        <div className="absolute md:absolute left-0 top-12 w-full md:w-[1000px] bg-gray-100 text-black shadow-xl rounded p-4 md:p-6 z-9999">

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-4 gap-6 text-sm">

            {/* Column 1 */}
            <div>
              <h3 className="font-semibold border-b-2 border-yellow-500 inline-block mb-3">
                Engineering & Technology
              </h3>
              <ul className="space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">SVITS</li>
                <li className="hover:text-blue-600 cursor-pointer">SVIIT</li>
                <li className="hover:text-blue-600 cursor-pointer">Textile Tech</li>
                <li className="hover:text-blue-600 cursor-pointer">Computer Applications</li>
              </ul>

              <h3 className="mt-4 font-semibold border-b-2 border-yellow-500 inline-block">
                Arts
              </h3>
              <ul className="mt-2">
                <li className="hover:text-blue-600 cursor-pointer">Fine Arts</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-semibold border-b-2 border-yellow-500 inline-block mb-3">
                Law, Management & Commerce
              </h3>
              <ul className="space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">Law</li>
                <li className="hover:text-blue-600 cursor-pointer">Management</li>
                <li className="hover:text-blue-600 cursor-pointer">Commerce</li>
              </ul>

              <h3 className="mt-4 font-semibold border-b-2 border-yellow-500 inline-block">
                Social Sciences
              </h3>
              <ul className="mt-2">
                <li className="hover:text-blue-600 cursor-pointer">Humanities</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-semibold border-b-2 border-yellow-500 inline-block mb-3">
                Science & Applied Fields
              </h3>
              <ul className="space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">Science</li>
                <li className="hover:text-blue-600 cursor-pointer">Forensic</li>
                <li className="hover:text-blue-600 cursor-pointer">Agriculture</li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="font-semibold border-b-2 border-yellow-500 inline-block mb-3">
                Health Sciences
              </h3>
              <ul className="space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">Paramedical</li>
                <li className="hover:text-blue-600 cursor-pointer">Pharmacy</li>
                <li className="hover:text-blue-600 cursor-pointer">Home Science</li>
              </ul>
            </div>

          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden space-y-3">

            {/* Section 1 */}
            <div>
              <button
                onClick={() => toggleMobile("eng")}
                className="w-full text-left font-semibold"
              >
                Engineering & Technology
              </button>
              {mobileOpen === "eng" && (
                <ul className="pl-4 mt-2 space-y-1 text-sm">
                  <li>SVITS</li>
                  <li>SVIIT</li>
                  <li>Textile Tech</li>
                  <li>Computer Applications</li>
                </ul>
              )}
            </div>

            {/* Section 2 */}
            <div>
              <button
                onClick={() => toggleMobile("law")}
                className="w-full text-left font-semibold"
              >
                Law, Management & Commerce
              </button>
              {mobileOpen === "law" && (
                <ul className="pl-4 mt-2 space-y-1 text-sm">
                  <li>Law</li>
                  <li>Management</li>
                  <li>Commerce</li>
                </ul>
              )}
            </div>

            {/* Section 3 */}
            <div>
              <button
                onClick={() => toggleMobile("science")}
                className="w-full text-left font-semibold"
              >
                Science & Applied Fields
              </button>
              {mobileOpen === "science" && (
                <ul className="pl-4 mt-2 space-y-1 text-sm">
                  <li>Science</li>
                  <li>Forensic</li>
                  <li>Agriculture</li>
                </ul>
              )}
            </div>

            {/* Section 4 */}
            <div>
              <button
                onClick={() => toggleMobile("health")}
                className="w-full text-left font-semibold"
              >
                Health Sciences
              </button>
              {mobileOpen === "health" && (
                <ul className="pl-4 mt-2 space-y-1 text-sm">
                  <li>Paramedical</li>
                  <li>Pharmacy</li>
                  <li>Home Science</li>
                </ul>
              )}
            </div>

          </div>
        </div>
      )}
    </li>


            {/* Other Links */}
            <li>
              <button
                type="button"
                onClick={() => scrollToId("home")}
                className="hover:text-yellow-400"
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToId("institutes")}
                className="hover:text-yellow-400"
              >
                Institutes
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToId("news")}
                className="hover:text-yellow-400"
              >
                News & Events
              </button>
            </li>
            <li>
              <Link to="/admission" className="hover:text-yellow-400">
                Admission
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-yellow-400">
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:brightness-95 transition"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#274472] px-4 pb-4 space-y-3">

            {/* About Mobile */}
            <div>
              <button
                onClick={() => toggleMenu("about")}
                className="flex justify-between w-full py-2"
              >
                About <ChevronDown />
              </button>

              {openMenu === "about" && (
                <div className="pl-4 space-y-2">
                  <a className="block">Shri Vaishnav Trusts</a>
                  <a className="block">About University</a>
                  <a className="block">Vision & Mission</a>
                </div>
              )}
            </div>

            {[
              { label: "Home", action: () => scrollToId("home") },
              { label: "Institutes", action: () => scrollToId("institutes") },
              { label: "News & Events", action: () => scrollToId("news") },
              { label: "Admission", action: () => navigate("/admission") },
              { label: "Contact", action: () => navigate("/contact") },
              { label: "Login", action: () => navigate("/login") },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="block w-full text-left py-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}