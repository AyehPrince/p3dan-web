import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { fetchActiveListings } from "@/lib/listings";
import { fetchRoomTypeOptions, fetchCityOptions } from "@/lib/options";
import ListingFilters from "@/components/ListingFilters";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Browse listings — p3dan",
  description: "Search rooms and apartments to rent across Ghana.",
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; roomType?: string; city?: string }>;
}) {
  const params = await searchParams;
  const [listings, roomTypes, cities] = await Promise.all([
    fetchActiveListings({
      q: params.q,
      roomTypeId: params.roomType,
      cityId: params.city,
    }),
    fetchRoomTypeOptions(),
    fetchCityOptions(),
  ]);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-6">
          {listings.length} {listings.length === 1 ? "place" : "places"} available
        </h1>

        <Suspense>
          <ListingFilters roomTypes={roomTypes} cities={cities} />
        </Suspense>

        {listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warmgray-600">No listings match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing, index) => (
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
        )}
      </main>
      <Footer />
    </>
  );
}