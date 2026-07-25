import Header from "@/components/Header";

export default function ListingsLoading() {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-8 w-48 bg-warmgray-100 rounded-lg mb-6" />
        <div className="h-11 w-full bg-warmgray-100 rounded-xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-warmgray-100">
              <div className="h-44 bg-warmgray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-2/3 bg-warmgray-100 rounded" />
                <div className="h-3 w-1/2 bg-warmgray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}