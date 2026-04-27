export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-blue-900 border-b-4 border-yellow-500 inline-block pb-2">
          Contact
        </h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Admissions</h2>
            <p className="mt-2 text-slate-700">Phone: +91 1800 102 9191</p>
            <p className="text-slate-700">Email: admission@svvv.edu.in</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Address</h2>
            <p className="mt-2 text-slate-700">
              Indore – Ujjain Road, Indore – 453111
            </p>
            <p className="text-slate-700">
              City Office: Shri Vaishnav Vidya Parisar, Indore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

