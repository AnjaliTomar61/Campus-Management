import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, X, Phone, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cx, ui } from "../lib/ui";

const navDropdownClass =
  "absolute z-[100] overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1.5 text-slate-900 shadow-xl ring-1 ring-slate-900/5";

const navDropdownItemClass =
  "block w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-amber-50 hover:text-slate-900";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [subMenu, setSubMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  /** Accordion inside institute mega-menu (mobile); separate from hamburger `mobileOpen` */
  const [instituteAccordion, setInstituteAccordion] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setSubMenu(null);
  };

  const toggleInstituteAccordion = (id) => {
    setInstituteAccordion((prev) => (prev === id ? null : id));
  };

  const scrollToId = async (id) => {
    setOpenMenu(null);
    setMobileOpen(false);
    setInstituteAccordion(null);

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
      {/* Top utility bar */}
      <div className="border-b border-white/10 bg-[#1f355e] text-white">
        <div
          className={cx(
            ui.landingContainer,
            "flex min-h-10 flex-wrap items-center justify-between gap-y-2 py-2 text-sm"
          )}
        >
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="tel:18001029191"
              className="inline-flex items-center gap-2 text-slate-200/95 transition hover:text-amber-300"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-amber-400/90" aria-hidden />
              1800 102 9191
            </a>
            <a
              href="mailto:admission@svvv.edu.in"
              className="inline-flex items-center gap-2 text-slate-200/95 transition hover:text-amber-300"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-amber-400/90" aria-hidden />
              admission@svvv.edu.in
            </a>
          </div>

          <div
            className="flex w-full flex-1 flex-wrap items-center justify-end gap-2 md:w-auto md:gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {["Placement", "Alumni", "Library", "ARIIA"].map((item) => (
              <button
                key={item}
                type="button"
                className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 transition hover:border-amber-400/40 hover:bg-amber-400/15 hover:text-amber-100 md:inline-flex"
              >
                {item}
              </button>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("erp")}
                className={cx(
                  ui.btnBase,
                  "rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 hover:text-slate-950"
                )}
              >
                ERP Login
                <ChevronDown className="h-3.5 w-3.5 opacity-90" aria-hidden />
              </button>

              {openMenu === "erp" && (
                <div className={cx(navDropdownClass, "right-0 z-[200] mt-2 w-48")}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/login?role=student");
                      setOpenMenu(null);
                    }}
                    className={navDropdownItemClass}
                  >
                    Student login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/login?role=faculty");
                      setOpenMenu(null);
                    }}
                    className={navDropdownItemClass}
                  >
                    Faculty login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/login?role=admin");
                      setOpenMenu(null);
                    }}
                    className={navDropdownItemClass}
                  >
                    Admin login
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="inline-flex rounded-lg border border-white/15 p-2 text-white transition hover:bg-white/10 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => {
                setMobileOpen((v) => {
                  if (v) setInstituteAccordion(null);
                  return !v;
                });
              }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-50 overflow-visible border-b border-white/10 bg-[#274472] text-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.45)]">
        <div
          className={cx(
            ui.landingContainer,
            "flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          )}
        >
          <Link
            to="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl py-1 outline-none ring-offset-2 ring-offset-[#274472] focus-visible:ring-2 focus-visible:ring-amber-400/80 sm:max-w-[min(100%,20rem)] md:max-w-[min(100%,24rem)] lg:max-w-none"
          >
            <img
              src="https://svvv.edu.in/images/logo.png"
              alt="SVVV"
              className="h-10 w-auto shrink-0 object-contain sm:h-11 md:h-12"
            />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex xl:max-w-md">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90 sm:text-[11px]">
                Smart Campus
              </span>
              <span className="line-clamp-2 text-xs font-semibold text-white sm:text-sm xl:line-clamp-none">
                Shri Vaishnav Vidyapeeth Vishwavidyalaya
              </span>
            </span>
          </Link>

          <div className="min-w-0 w-full flex-1 overflow-x-auto overflow-y-visible sm:w-auto md:overflow-x-visible">
            <ul
              className={cx(
                "relative hidden w-full min-w-0 flex-wrap items-center justify-start gap-x-1 gap-y-2 sm:justify-end",
                "md:flex md:w-max md:max-w-full md:flex-nowrap md:justify-end md:gap-x-1 md:pb-1",
                "md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden",
                "lg:gap-x-1.5"
              )}
              onClick={(e) => e.stopPropagation()}
            >

            {/* About Menu */}
            <li className="relative shrink-0">
              <button
                type="button"
                onClick={() => toggleMenu("about")}
                className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:px-3 md:text-[15px]"
              >
                About <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </button>

              {openMenu === "about" && (
                <div className={cx(navDropdownClass, "left-0 top-full z-[200] mt-1 w-64 max-w-[calc(100vw-2rem)]")}>
                  <button
                    type="button"
                    onClick={() => scrollToId("about")}
                    className={navDropdownItemClass}
                  >
                    About University
                  </button>

                  <Link to="/about" className={navDropdownItemClass}>
                    Vision & Mission
                  </Link>

                  {/* Submenu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setSubMenu("desk")}
                    onMouseLeave={() => setSubMenu(null)}
                  >
                    <div className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm text-slate-700 transition hover:bg-amber-50">
                      From the Desk of <ChevronRight className="h-4 w-4" aria-hidden />
                    </div>

                    {subMenu === "desk" && (
                      <div
                        className={cx(
                          navDropdownClass,
                          "left-0 top-full z-[210] mt-1 w-52 max-w-[calc(100vw-2rem)] lg:left-full lg:top-0 lg:mt-0 lg:ml-1"
                        )}
                      >
                        <Link to="/about" className={navDropdownItemClass}>
                          Chancellor
                        </Link>
                        <Link to="/about" className={navDropdownItemClass}>
                          Vice Chancellor
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link to="/about" className={navDropdownItemClass}>
                    Approval & Affiliation
                  </Link>
                  <Link to="/about" className={navDropdownItemClass}>
                    Annual Report
                  </Link>
                  <Link to="/about" className={navDropdownItemClass}>
                    Administration
                  </Link>
                </div>
              )}
            </li>
            <li className="relative shrink-0">
              <button
                type="button"
                onClick={() => toggleMenu("why")}
                className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:px-3 md:text-[15px]"
              >
                Why SVVV <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </button>

              {openMenu === "why" && (
                <div
                  className={cx(
                    navDropdownClass,
                    "right-0 top-full z-[200] mt-1 w-[min(100vw-1.5rem,900px)] max-w-[calc(100vw-1.5rem)] origin-top-right",
                    "max-h-[min(70vh,560px)] overflow-y-auto bg-slate-50 p-5 sm:p-6",
                    "xl:left-0 xl:right-auto xl:max-w-[900px]"
                  )}
                >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

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
        <div className="min-h-[140px] overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200 shadow-inner sm:min-h-0">
          <img
            src="https://www.svvv.edu.in/assets/images/slider/slider-02.webp"
            alt="SVVV campus"
            className="h-full min-h-[140px] w-full object-cover sm:min-h-[200px]"
          />
        </div>

                </div>
              </div>
              )}
            </li>
            <li className="relative shrink-0">
      
      {/* Button */}
      <button
        type="button"
        onClick={() => toggleMenu("institute")}
        className="flex w-full items-center justify-between gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:w-auto md:px-3 md:text-[15px]"
      >
        Our Institute <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      </button>

      {/* Dropdown */}
      {openMenu === "institute" && (
        <div
          className={cx(
            navDropdownClass,
            "left-0 top-full z-[200] mt-1 w-full max-h-[min(75vh,640px)] max-w-[calc(100vw-1.5rem)] overflow-y-auto bg-slate-50 p-4 text-slate-900 md:left-auto md:right-0 md:w-[min(100vw-2rem,1000px)] md:max-w-none md:p-6"
          )}
        >

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
                onClick={() => toggleInstituteAccordion("eng")}
                className="w-full text-left font-semibold"
              >
                Engineering & Technology
              </button>
              {instituteAccordion === "eng" && (
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
                onClick={() => toggleInstituteAccordion("law")}
                className="w-full text-left font-semibold"
              >
                Law, Management & Commerce
              </button>
              {instituteAccordion === "law" && (
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
                onClick={() => toggleInstituteAccordion("science")}
                className="w-full text-left font-semibold"
              >
                Science & Applied Fields
              </button>
              {instituteAccordion === "science" && (
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
                onClick={() => toggleInstituteAccordion("health")}
                className="w-full text-left font-semibold"
              >
                Health Sciences
              </button>
              {instituteAccordion === "health" && (
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
            <li className="shrink-0">
              <button
                type="button"
                onClick={() => scrollToId("home")}
                className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:px-3 md:text-[15px]"
              >
                Home
              </button>
            </li>
            <li className="shrink-0">
              <button
                type="button"
                onClick={() => scrollToId("institutes")}
                className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:px-3 md:text-[15px]"
              >
                Institutes
              </button>
            </li>
            <li className="shrink-0">
              <button
                type="button"
                onClick={() => scrollToId("news")}
                className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:px-3 md:text-[15px]"
              >
                News & Events
              </button>
            </li>
            <li className="shrink-0">
              <Link
                to="/admission"
                className="inline-flex whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:px-3 md:text-[15px]"
              >
                Admission
              </Link>
            </li>
            <li className="shrink-0">
              <Link
                to="/contact"
                className="inline-flex whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-amber-200 md:px-3 md:text-[15px]"
              >
                Contact
              </Link>
            </li>
            <li className="shrink-0 pl-1">
              <Link
                to="/login"
                className={cx(
                  ui.btnBase,
                  "rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-amber-300"
                )}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className={cx(
              ui.landingContainer,
              "border-t border-white/10 bg-[#274472]/98 py-4 backdrop-blur-md md:hidden"
            )}
          >

            {/* About Mobile */}
            <div className="rounded-xl border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => toggleMenu("about")}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-white"
              >
                About <ChevronDown className="h-4 w-4 opacity-80" aria-hidden />
              </button>

              {openMenu === "about" && (
                <div className="space-y-1 border-t border-white/10 px-2 py-2">
                  <span className="block rounded-lg px-3 py-2 text-sm text-slate-200">Shri Vaishnav Trusts</span>
                  <span className="block rounded-lg px-3 py-2 text-sm text-slate-200">About University</span>
                  <Link to="/about" className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
                    Vision & Mission
                  </Link>
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
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/95 transition hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        </div>
      </header>
    </>
  );
}