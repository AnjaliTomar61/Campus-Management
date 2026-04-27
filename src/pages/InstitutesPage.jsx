import Institute from "../components/Institute";

export default function InstitutesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <h1 className="text-3xl font-bold text-blue-900 border-b-4 border-yellow-500 inline-block pb-2">
          Institutes
        </h1>
        <p className="mt-4 text-gray-700">
          Browse SVVV institutes and explore programs offered by each institute.
        </p>
      </div>
      <Institute />
    </div>
  );
}

