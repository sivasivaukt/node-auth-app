export default function BOHome() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏢</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Back Office</h1>
        <p className="text-gray-500 text-sm mb-4">
          This is the admin back office app — running on{" "}
          <span className="font-mono text-indigo-600">port 3002</span>.
        </p>
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700">
          Coming soon — admin features will be built here.
        </div>
      </div>
    </div>
  );
}
