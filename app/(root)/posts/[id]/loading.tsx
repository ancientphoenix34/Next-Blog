export default function Loading() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      {/* Category + title */}
      <div className="mb-6 space-y-3">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-2/3 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Thumbnail */}
      <div className="w-full h-72 bg-gray-200 rounded-xl animate-pulse mb-8" />

      {/* Content lines */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-200 rounded animate-pulse ${i % 5 === 4 ? "w-1/2" : "w-full"}`}
          />
        ))}
      </div>
    </section>
  );
}
