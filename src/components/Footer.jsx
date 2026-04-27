import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight, GraduationCap } from "lucide-react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { cx, ui } from "../lib/ui";

const exploreLinks = [
  { to: "/about", label: "About SVVV" },
  { to: "/admission", label: "Admission" },
  { to: "/institutes", label: "Institutes" },
  { to: "/contact", label: "Contact" },
];

const resourceLinks = [
  { to: "/admission", label: "Apply online" },
  { label: "Research", href: "https://www.svvv.edu.in/" },
  { label: "Library", href: "https://www.svvv.edu.in/" },
  { label: "Placements", href: "https://www.svvv.edu.in/" },
];

const portalLinks = [
  { to: "/login?role=student", label: "Student portal" },
  { to: "/login?role=faculty", label: "Faculty portal" },
  { to: "/login?role=admin", label: "Admin portal" },
];

const social = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/" },
  { icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/" },
  { icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/" },
];

function FooterLink({ to, href, label }) {
  const className =
    "group inline-flex items-center gap-1 text-sm text-slate-300 transition hover:text-amber-300";

  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden />
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-linear-to-b from-[#0f172a] via-[#152a4a] to-[#0f172a] text-white">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl"
        aria-hidden
      />

      <div className={cx(ui.landingContainer, "relative py-12 sm:py-14 lg:py-16")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 rounded-xl outline-none ring-offset-2 ring-offset-[#0f172a] focus-visible:ring-2 focus-visible:ring-amber-400/80">
              <img
                src="https://svvv.edu.in/images/logo.png"
                alt="SVVV logo"
                className="h-12 w-auto object-contain drop-shadow-sm"
              />
              <span className="sr-only">Shri Vaishnav Vidyapeeth Vishwavidyalaya — home</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              A NAAC-focused university on Indore–Ujjain Road, building careers through teaching, research, and industry
              partnerships.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {social.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-200"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </a>
              ))}
            </div>
            <Link
              to="/admission"
              className={cx(
                ui.btnBase,
                "mt-8 inline-flex min-h-11 items-center gap-2 bg-amber-400 px-5 text-sm font-semibold text-slate-950 shadow-lg hover:bg-amber-300"
              )}
            >
              <GraduationCap className="h-5 w-5 shrink-0" aria-hidden />
              Apply for admission
            </Link>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300/90">Contact</h2>
            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-amber-400">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block font-medium text-white">Helpline</span>
                  <a href="tel:18001029191" className="mt-0.5 block text-slate-400 transition hover:text-amber-300">
                    1800 102 9191
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-amber-400">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block font-medium text-white">Admissions</span>
                  <a
                    href="mailto:admission@svvv.edu.in"
                    className="mt-0.5 block break-all text-slate-400 transition hover:text-amber-300"
                  >
                    admission@svvv.edu.in
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-amber-400">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block font-medium text-white">Campus</span>
                  <span className="mt-0.5 block leading-relaxed text-slate-400">
                    Indore – Ujjain Road, Indore – 453111
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Explore + Resources */}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300/90">Explore</h2>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer explore">
                {exploreLinks.map(({ to, label }) => (
                  <FooterLink key={to} to={to} label={label} />
                ))}
              </nav>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300/90">Resources</h2>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer resources">
                {resourceLinks.map((item) =>
                  item.to ? (
                    <FooterLink key={item.to} to={item.to} label={item.label} />
                  ) : (
                    <FooterLink key={item.label} href={item.href} external label={item.label} />
                  )
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Portals strip */}
        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Portals</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {portalLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium text-white underline-offset-4 transition hover:text-amber-300 hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div
          className={cx(
            ui.landingContainer,
            "flex flex-col items-center justify-between gap-3 py-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left"
          )}
        >
          <p>© {new Date().getFullYear()} Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
            <span className="cursor-default text-slate-600">Privacy</span>
            <span className="text-slate-700">·</span>
            <span className="cursor-default text-slate-600">Terms</span>
            <span className="text-slate-700">·</span>
            <span className="cursor-default text-slate-600">Refund policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
