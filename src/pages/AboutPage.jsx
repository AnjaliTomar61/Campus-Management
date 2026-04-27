import WelcomeAndNotice from "../components/WelcomeAndNotice";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-blue-900 border-b-4 border-yellow-500 inline-block pb-2">
          About SVVV
        </h1>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Smart Campus Management System is designed around a real university flow:
          admissions, academics, attendance, results, fees, notices, and documents.
        </p>
      </div>
      <WelcomeAndNotice />
    </div>
  );
}

