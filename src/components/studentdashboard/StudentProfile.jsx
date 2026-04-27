import React, { useEffect, useState } from "react";
import { UserRound, Mail, Phone } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function emptyAddr() {
  return { street: "", city: "", state: "", pincode: "" };
}

function labelAdmission(s) {
  if (!s) return "—";
  if (s === "pending") return "Pending";
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return s;
}

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    dob: "",
    bio: "",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: "",
    bloodGroup: "",
    documentsNote: "",
    currentAddress: emptyAddr(),
    permanentAddress: emptyAddr(),
  });

  const load = async () => {
    const res = await api.get("/api/v1/user/me/profile", {
      meta: { suppressErrorToast: true, silent: true },
    });
    const u = res.data?.user;
    const p = res.data?.profile;
    setUser(u);
    setProfile(p);
    if (u) {
      setForm((prev) => ({
        ...prev,
        name: u.name ?? "",
        mobile: u.mobile ?? "",
        gender: u.gender ?? "",
        dob: u.dob ? String(u.dob).slice(0, 10) : "",
        bio: u.bio ?? "",
      }));
    }
    if (p) {
      setForm((prev) => ({
        ...prev,
        guardianName: p.guardianName ?? "",
        guardianPhone: p.guardianPhone ?? "",
        guardianRelation: p.guardianRelation ?? "",
        bloodGroup: p.bloodGroup ?? "",
        documentsNote: p.documentsNote ?? "",
        currentAddress: { ...emptyAddr(), ...p.currentAddress },
        permanentAddress: { ...emptyAddr(), ...p.permanentAddress },
      }));
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setAddrField = (which, field, value) => {
    setForm((prev) => ({
      ...prev,
      [which]: { ...prev[which], [field]: value },
    }));
  };

  const onField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(
        "/api/v1/user/me/profile",
        {
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          gender: form.gender || undefined,
          dob: form.dob || null,
          bio: form.bio,
          guardianName: form.guardianName.trim(),
          guardianPhone: form.guardianPhone.trim(),
          guardianRelation: form.guardianRelation.trim(),
          bloodGroup: form.bloodGroup.trim(),
          documentsNote: form.documentsNote,
          currentAddress: form.currentAddress,
          permanentAddress: form.permanentAddress,
        },
        { meta: { successMessage: "Profile saved" } }
      );
      await load();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-600">Loading profile…</p>
      </div>
    );
  }

  if (!user || user.role !== "student") {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-700">Sign in as a student to view your profile.</p>
      </div>
    );
  }

  const p = profile;

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className={cx("mx-auto max-w-3xl space-y-8 p-6 sm:p-8", ui.card)}>
        <header>
          <h2 className="text-xl font-bold text-slate-900">Student profile</h2>
          <p className="mt-1 text-sm text-slate-500">
            You can update your personal details below. Enrollment, department, course, semester, and admission status
            are updated by your assigned faculty mentor or the administration.
          </p>
        </header>

        <section className="rounded-xl border border-amber-200/80 bg-linear-to-br from-amber-50/90 to-white px-4 py-5 text-sm shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <UserRound className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900">My assigned faculty (mentor)</h3>
              {p?.assignedFaculty?.name ? (
                <dl className="mt-3 space-y-2">
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Name</dt>
                    <dd className="text-base font-semibold text-slate-900">{p.assignedFaculty.name}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex min-w-0 items-center gap-1.5 text-slate-700">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                      <a href={`mailto:${p.assignedFaculty.email}`} className="truncate text-sm underline-offset-2 hover:underline">
                        {p.assignedFaculty.email}
                      </a>
                    </div>
                    {p.assignedFaculty.mobile ? (
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                        <a href={`tel:${p.assignedFaculty.mobile}`} className="text-sm">
                          {p.assignedFaculty.mobile}
                        </a>
                      </div>
                    ) : null}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Your mentor can update your academic placement and help complete guardian and address details on
                    their side. Use the contact above for course-related questions.
                  </p>
                </dl>
              ) : (
                <p className="mt-2 text-sm text-slate-600">
                  No faculty mentor is assigned yet. The administration will link a teacher to your record when ready.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          <h3 className="text-sm font-semibold text-slate-900">Academic record (read-only)</h3>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500">Enrollment number</dt>
              <dd className="font-medium text-slate-900">{p?.enrollmentNo || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Admission status</dt>
              <dd className="font-medium text-slate-900">{labelAdmission(p?.admissionStatus)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Department</dt>
              <dd className="font-medium text-slate-900">{p?.department?.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Course</dt>
              <dd className="font-medium text-slate-900">
                {p?.course?.courseName || "—"}
                {p?.course?.courseCode ? (
                  <span className="block text-xs font-normal text-slate-500">{p.course.courseCode}</span>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Current semester</dt>
              <dd className="font-medium text-slate-900">
                {p?.currentSemester ? `Semester ${p.currentSemester.number}` : "—"}
                {p?.currentSemester?.title ? (
                  <span className="block text-xs font-normal text-slate-500">{p.currentSemester.title}</span>
                ) : null}
              </dd>
            </div>
          </dl>
        </section>

        <form onSubmit={onSave} className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Account & contact</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={(e) => onField("name", e.target.value)} />
              <Field label="Email (read-only)" value={user.email} readOnly className="bg-slate-50" />
              <Field label="Mobile" type="tel" value={form.mobile} onChange={(e) => onField("mobile", e.target.value)} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">Gender</label>
                <select
                  className={ui.select}
                  value={form.gender}
                  onChange={(e) => onField("gender", e.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Field label="Date of birth" type="date" value={form.dob} onChange={(e) => onField("dob", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Short bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => onField("bio", e.target.value)}
                rows={3}
                className={cx(ui.input, "mt-1 w-full")}
              />
            </div>
          </section>

          <AddressBlock title="Current address" prefix="currentAddress" addr={form.currentAddress} onChange={setAddrField} />
          <AddressBlock title="Permanent address" prefix="permanentAddress" addr={form.permanentAddress} onChange={setAddrField} />

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Guardian</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name" value={form.guardianName} onChange={(e) => onField("guardianName", e.target.value)} />
              <Field label="Phone" value={form.guardianPhone} onChange={(e) => onField("guardianPhone", e.target.value)} />
              <Field label="Relation" value={form.guardianRelation} onChange={(e) => onField("guardianRelation", e.target.value)} />
            </div>
          </section>

          <div>
            <label className="text-xs font-medium text-slate-500">Blood group</label>
            <input
              className={cx(ui.input, "mt-1 max-w-xs")}
              value={form.bloodGroup}
              onChange={(e) => onField("bloodGroup", e.target.value)}
              placeholder="e.g. B+"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Documents / uploads note</label>
            <textarea
              value={form.documentsNote}
              onChange={(e) => onField("documentsNote", e.target.value)}
              rows={2}
              className={cx(ui.input, "mt-1 w-full")}
              placeholder="Describe documents you will upload or have submitted"
            />
          </div>

          <button type="submit" disabled={saving} className={cx(ui.btnBase, ui.btnPrimary, "min-h-10 px-5")}>
            {saving ? "Saving…" : "Save personal details"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddressBlock({ title, prefix, addr, onChange }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Street" value={addr.street} onChange={(e) => onChange(prefix, "street", e.target.value)} />
        <Field label="City" value={addr.city} onChange={(e) => onChange(prefix, "city", e.target.value)} />
        <Field label="State" value={addr.state} onChange={(e) => onChange(prefix, "state", e.target.value)} />
        <Field label="Pincode" value={addr.pincode} onChange={(e) => onChange(prefix, "pincode", e.target.value)} />
      </div>
    </section>
  );
}

function Field({ label, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input {...props} className={cx(ui.input, className)} />
    </div>
  );
}
