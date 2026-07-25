import Image from "next/image";
import Link from "next/link";
import { fetchActiveListings } from "@/lib/listings";
import PinIcon from "@/components/PinIcon";
import PinScatter from "@/components/PinScatter";
import SearchBar from "@/components/SearchBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  {
    number: "01",
    title: "Search by what matters",
    description:
      "Filter by real room types — single room, chamber and hall, self-contain — and the areas you actually know.",
  },
  {
    number: "02",
    title: "See the real cost upfront",
    description:
      "Rent, lease term, deposit, payment structure — all shown before you ever leave home.",
  },
  {
    number: "03",
    title: "Contact the landlord directly",
    description:
      "No agent middleman. Message on WhatsApp and arrange a viewing yourself.",
  },
];

export default async function Home() {
  const listings = await fetchActiveListings();

  return (
    <main>
      <Header />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl leading-tight mb-4">
              Find your next place in Ghana
            </h1>
            <p className="text-warmgray-600 text-lg mb-8 leading-relaxed">
              Search rooms and apartments by room type and area, with real
              fees shown upfront — no wasted trips, no hidden agent charges.
            </p>
            <SearchBar />
          </div>

          <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden border border-warmgray-100">
            <Image
              src="/accra-hero.jpg"
              alt="Accra, Ghana"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 via-transparent to-transparent" />

            <div className="absolute top-[20%] left-[22%] flex flex-col items-center gap-1">
              <PinIcon size={18} color="#D85A30" />
              <span className="text-[11px] text-canvas font-medium bg-teal-900/70 px-2 py-0.5 rounded-md">
                Osu
              </span>
            </div>
            <div className="absolute top-[55%] left-[62%] flex flex-col items-center gap-1">
              <PinIcon size={16} color="#EDE7DC" />
              <span className="text-[11px] text-canvas font-medium bg-teal-900/70 px-2 py-0.5 rounded-md">
                East Legon
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-warmgray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="text-coral-400 font-heading font-bold text-sm">
                {step.number}
              </span>
              <h3 className="font-heading font-bold text-lg mt-2 mb-2">
                {step.title}
              </h3>
              <p className="text-warmgray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-warmgray-100">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-heading font-bold text-2xl">
            {listings.length} {listings.length === 1 ? "place" : "places"}{" "}
            available now
          </h2>
          <Link
            href="/listings"
            className="text-teal-600 text-sm font-medium hover:text-teal-800"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.slice(0, 6).map((listing, index) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="bg-canvas-card border border-warmgray-100 rounded-2xl overflow-hidden hover:border-warmgray-200 transition-colors"
            >
              <div className="h-44 bg-warmgray-100 relative">
                {listing.imageUrl && (
                  <Image
                    src={listing.imageUrl}
                    alt={listing.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    priority={index < 3}
                    className="object-cover"
                  />
                )}
                {listing.verified && (
                  <span className="absolute top-2.5 left-2.5 bg-teal-900 text-teal-50 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                    verified
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-medium text-sm">
                    {listing.room_type_name}
                  </span>
                  <span className="text-coral-600 font-medium text-sm">
                    GHS {listing.price.toLocaleString()}/mo
                  </span>
                </div>
                <p className="text-warmgray-600 text-xs">
                  {listing.area_name}, {listing.city} ·{" "}
                  {listing.lease_term_years}{" "}
                  {listing.lease_term_years === 1 ? "year" : "years"} lease
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}