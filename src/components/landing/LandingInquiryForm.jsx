import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, MessageCircle } from "lucide-react";
import { cx, ui } from "../../lib/ui";
import { notify } from "../../lib/notify";

const initial = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
};

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

export default function LandingInquiryForm() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      notify({ type: "error", message: "Please fill in your name, email, and message." });
      return;
    }
    if (!isValidEmail(email)) {
      notify({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    try {
      // Hook up to your API later, e.g. POST /api/v1/inquiries
      await new Promise((r) => setTimeout(r, 400));
      notify({
        type: "success",
        message: "Thanks — we received your enquiry. Our team will get back to you soon.",
      });
      setForm(initial);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="inquiry"
      className="border-t border-slate-200/80 bg-linear-to-b from-white via-(--brand-bg) to-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="inquiry-heading"
    >
      <div className={cx(ui.landingContainer)}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Admissions & support</p>
            <h2 id="inquiry-heading" className={cx(ui.landingSectionTitle, "mt-2")}>
              Send us an enquiry
            </h2>
            <div className={cx(ui.landingSectionAccent)} />
            <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
              Ask about programmes, eligibility, campus visits, or documents. For detailed follow-up you can also
              visit the contact page after submitting this form.
            </p>
            <Link
              to="/contact"
              className={cx(
                ui.btnBase,
                "mt-6 inline-flex min-h-10 items-center gap-2 border border-slate-200 bg-white px-4 text-sm font-semibold text-(--brand-blue) shadow-sm hover:bg-slate-50"
              )}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Full contact page
            </Link>
          </div>

          <div className={cx(ui.card, "p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.12)] sm:p-8")}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="inquiry-name" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full name
                  </label>
                  <input
                    id="inquiry-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={onChange}
                    className={ui.input}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-email" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </label>
                  <input
                    id="inquiry-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={onChange}
                    className={ui.input}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-phone" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mobile <span className="font-normal normal-case text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="inquiry-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={onChange}
                    className={ui.input}
                    placeholder="10-digit number"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="inquiry-interest" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    I am interested in
                  </label>
                  <select
                    id="inquiry-interest"
                    name="interest"
                    value={form.interest}
                    onChange={onChange}
                    className={ui.select}
                  >
                    <option value="">Select an option</option>
                    <option value="ug">Undergraduate (UG)</option>
                    <option value="pg">Postgraduate (PG)</option>
                    <option value="research">Research / Ph.D.</option>
                    <option value="campus">Campus visit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="inquiry-message" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={onChange}
                  className={ui.textarea}
                  placeholder="Tell us what you would like to know…"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  By submitting, you agree to be contacted regarding your enquiry.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className={cx(
                    ui.btnBase,
                    "min-h-11 shrink-0 justify-center gap-2 bg-(--brand-navy) px-6 text-sm font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-60"
                  )}
                >
                  <Send className="h-4 w-4" aria-hidden />
                  {submitting ? "Sending…" : "Submit enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
