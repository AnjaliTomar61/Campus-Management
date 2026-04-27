import React, { useEffect, useState, useMemo } from "react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function emptyAddr() {
  return { street: "", city: "", state: "", pincode: "" };
}

export default function FacultyProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [employment, setEmployment] = useState(null);
  const [profileDoc, setProfileDoc] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    dob: "",
    bio: "",
    address: emptyAddr(),
    officeRoom: "",
    specialization: "",
    qualification: "",
    profilePhoto: "",
    subjects: "",
    experienceYears: "",
    experienceSummary: "",
  });

  const load = async () => {
    const profRes = await api.get("/api/v1/user/me/profile", {
      meta: { suppressErrorToast: true, silent: true },
    });
    const u = profRes.data?.user;
    const p = profRes.data?.profile;
    const emp = profRes.data?.employment ?? null;
    setUser(u);
    setEmployment(emp);
    setProfileDoc(p);

    if (u) {
      setForm((prev) => ({
        ...prev,
        name: u.name ?? "",
        mobile: u.mobile ?? "",
        gender: u.gender ?? "",
        dob: u.dob ? String(u.dob).slice(0, 10) : "",
        bio: u.bio ?? "",
        address: { ...emptyAddr(), ...(u.address || {}) },
      }));
    }
    if (p) {
      setForm((prev) => ({
        ...prev,
        officeRoom: p.officeRoom ?? "",
        specialization: p.specialization ?? "",
        qualification: p.qualification ?? "",
        profilePhoto: p.profilePhoto ?? "",
        subjects: Array.isArray(p.subjects) ? p.subjects.join(", ") : "",
        experienceYears: p.experienceYears != null ? String(p.experienceYears) : "",
        experienceSummary: p.experienceSummary ?? "",
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

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setAddr = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const payload = useMemo(() => {
    return {
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      gender: form.gender || undefined,
      dob: form.dob || null,
      bio: form.bio,
      address: form.address,
      officeRoom: form.officeRoom.trim(),
      specialization: form.specialization.trim(),
      qualification: form.qualification.trim(),
      profilePhoto: form.profilePhoto.trim(),
      subjects: form.subjects,
      experienceYears: form.experienceYears === "" ? null : form.experienceYears,
      experienceSummary: form.experienceSummary,
    };
  }, [form]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/v1/user/me/profile", payload, {
        meta: { successMessage: "Faculty profile saved" },
      });
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

  if (!user || user.role !== "faculty") {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-700">Sign in as faculty to manage your profile.</p>
      </div>
    );
  }

  const catalogDept = profileDoc?.department;
  const catalogDeptLabel =
    catalogDept && typeof catalogDept === "object"
      ? `${catalogDept.name}${catalogDept.code ? ` (${catalogDept.code})` : ""}`
      : "—";

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className={cx("mx-auto max-w-3xl space-y-8 p-6 sm:p-8", ui.card)}>
        <header>
          <h2 className="text-xl font-bold text-slate-900">Faculty profile</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your own contact details and teaching profile. Official department, designation, and employee ID are
            set only by administration (see Faculty placement in the admin console).
          </p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          <h3 className="text-sm font-semibold text-slate-900">Official placement (read-only)</h3>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500">Catalog department</dt>
              <dd className="font-medium text-slate-900">{catalogDeptLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Designation</dt>
              <dd className="font-medium text-slate-900">{profileDoc?.designation || employment?.designation || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Employee ID</dt>
              <dd className="font-medium text-slate-900">
                {profileDoc?.employeeId || employment?.employeeId || "—"}
              </dd>
            </div>
            {employment?.departmentName ? (
              <div>
                <dt className="text-xs font-medium text-slate-500">HR department label</dt>
                <dd className="font-medium text-slate-900">{employment.departmentName}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <form onSubmit={onSave} className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Account & contact</h3>
            <p className="text-xs text-slate-500">Email is your portal login and cannot be changed here.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" value={form.name} onChange={onChange} />
              <Field label="Email (read-only)" name="_email" value={user.email} readOnly className="bg-slate-50" />
              <Field label="Mobile" name="mobile" type="tel" value={form.mobile} onChange={onChange} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">Gender</label>
                <select name="gender" value={form.gender} onChange={onChange} className={ui.select}>
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Field label="Date of birth" name="dob" type="date" value={form.dob} onChange={onChange} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Short bio</label>
              <textarea name="bio" value={form.bio} onChange={onChange} rows={3} className={cx(ui.input, "mt-1 w-full")} />
            </div>
            <AddressBlock title="Address" addr={form.address} onChange={setAddr} />
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Teaching & office</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Office / room" name="officeRoom" value={form.officeRoom} onChange={onChange} />
              <Field label="Qualification" name="qualification" value={form.qualification} onChange={onChange} />
              <Field label="Profile photo URL" name="profilePhoto" value={form.profilePhoto} onChange={onChange} />
              <Field label="Years of experience" name="experienceYears" type="number" min={0} value={form.experienceYears} onChange={onChange} />
            </div>
            <Field label="Specialization" name="specialization" value={form.specialization} onChange={onChange} />
            <div>
              <label className="text-xs font-medium text-slate-500">Subjects (comma-separated)</label>
              <textarea
                name="subjects"
                value={form.subjects}
                onChange={onChange}
                rows={2}
                placeholder="e.g. Data Structures, DBMS"
                className={cx(ui.input, "mt-1 w-full")}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Experience summary</label>
              <textarea
                name="experienceSummary"
                value={form.experienceSummary}
                onChange={onChange}
                rows={3}
                className={cx(ui.input, "mt-1 w-full")}
              />
            </div>
          </section>

          <button type="submit" disabled={saving} className={cx(ui.btnBase, ui.btnPrimary, "min-h-10 px-5")}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddressBlock({ title, addr, onChange }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Street" value={addr.street} onChange={(e) => onChange("street", e.target.value)} />
        <Field label="City" value={addr.city} onChange={(e) => onChange("city", e.target.value)} />
        <Field label="State" value={addr.state} onChange={(e) => onChange("state", e.target.value)} />
        <Field label="Pincode" value={addr.pincode} onChange={(e) => onChange("pincode", e.target.value)} />
      </div>
    </div>
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
