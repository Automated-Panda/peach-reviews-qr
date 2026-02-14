export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full px-8 py-10 text-center">
        <h1 className="text-xl font-semibold text-[#202124] mb-2">
          Page Not Found
        </h1>
        <p className="text-[#5f6368]">
          The link you followed doesn&apos;t exist or has been removed.
        </p>
      </div>
    </main>
  );
}
