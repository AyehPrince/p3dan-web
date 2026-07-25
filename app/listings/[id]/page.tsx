import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchListingDetail } from "@/lib/listings";
import { buildWhatsAppLink } from "@/lib/phone";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PinIcon from "@/components/PinIcon";

const paymentLabels: Record<string, string> = {
  full_upfront: "Full amount upfront",
  installments: "Installments negotiable",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await fetchListingDetail(id);
  if (!listing) return { title: "Listing not found — p3dan" };
  return {
    title: `${listing.title} — GHS ${listing.price.toLocaleString()}/mo — p3dan`,
    description: `${listing.room_type_name} in ${listing.area_name}, ${listing.city}. ${listing.description ?? ""}`,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await fetchListingDetail(id);

  if (!listing) {
    notFound();
  }

  const whatsappLink = listing.owner_phone
    ? buildWhatsAppLink(
        listing.owner_phone,
        `Hi, I'm interested in your listing "${listing.title}" on p3dan.`
      )
    : null;

  const imageCount = listing.images.length;

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        {imageCount === 0 && (
          <div className="h-96 rounded-2xl bg-warmgray-100 flex items-center justify-center mb-8">
            <PinIcon size={30} color="#B4B2A9" />
          </div>
        )}

        {imageCount === 1 && (
          <div className="relative h-96 rounded-2xl overflow-hidden bg-warmgray-100 mb-8">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              sizes="(min-width: 768px) 896px, 100vw"
              className="object-cover"
              priority
            />
            {listing.verified && (
              <span className="absolute top-3 left-3 bg-teal-900 text-teal-50 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                verified
              </span>
            )}
          </div>
        )}

        {imageCount > 1 && (
          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 relative">
            {listing.images.slice(0, 4).map((url, i) => (
              <div
                key={i}
                className={`relative h-64 bg-warmgray-100 ${
                  i === 0 ? "col-span-2 h-96" : ""
                }`}
              >
                <Image
                  src={url}
                  alt={listing.title}
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 896px, 100vw" : "(min-width: 768px) 448px, 50vw"}
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
            {listing.verified && (
              <span className="absolute top-3 left-3 bg-teal-900 text-teal-50 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                verified
              </span>
            )}
          </div>
        )}

        <h1 className="font-heading font-bold text-2xl mb-1">{listing.title}</h1>
        <div className="flex justify-between items-start mb-1">
          <span className="text-coral-600 font-heading font-bold text-2xl">
            GHS {listing.price.toLocaleString()}
          </span>
        </div>
        <p className="text-warmgray-600 mb-5">per month</p>

        <div className="flex items-center gap-1.5 mb-6 text-warmgray-700 text-sm">
          <PinIcon size={14} />
          {listing.area_name}, {listing.city}
        </div>

        <div className="flex gap-3 mb-8">
          <div className="bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3">
            <p className="text-warmgray-400 text-[11px] uppercase tracking-wide mb-0.5">
              Room type
            </p>
            <p className="text-sm font-medium">{listing.room_type_name}</p>
          </div>
          <div className="bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3">
            <p className="text-warmgray-400 text-[11px] uppercase tracking-wide mb-0.5">
              Lease term
            </p>
            <p className="text-sm font-medium">
              {listing.lease_term_years} {listing.lease_term_years === 1 ? "year" : "years"}
            </p>
          </div>
        </div>

        {listing.description && (
          <>
            <h2 className="font-medium mb-2">About this place</h2>
            <p className="text-warmgray-600 text-sm leading-relaxed mb-8">
              {listing.description}
            </p>
          </>
        )}

        <h2 className="font-medium mb-2">Cost breakdown</h2>
        <div className="bg-canvas-card border border-warmgray-100 rounded-2xl px-4 py-1 mb-8">
          <div className="flex justify-between py-3 border-b border-warmgray-50 text-sm">
            <span className="text-warmgray-700">Rent per month</span>
            <span className="font-medium">GHS {listing.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-warmgray-50 text-sm">
            <span className="text-warmgray-700">Payment structure</span>
            <span className="font-medium">
              {paymentLabels[listing.payment_structure] || listing.payment_structure}
            </span>
          </div>
          <div className="flex justify-between py-3 text-sm">
            <span className="text-warmgray-700">Extra deposit</span>
            <span className="font-medium">
              {listing.deposit_months > 0 ? `${listing.deposit_months} months` : "None"}
            </span>
          </div>
        </div>

        {listing.owner_name && (
          <>
            <h2 className="font-medium mb-2">Listed by</h2>
            <div className="bg-canvas-card border border-warmgray-100 rounded-2xl px-4 py-4 flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="text-sm">{listing.owner_name}</span>
                {listing.owner_is_trusted && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-teal-100 text-teal-900">
                    trusted landlord
                  </span>
                )}
              </div>
              {whatsappLink ? (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-teal-600 text-canvas text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors">
                  Message on WhatsApp
                </a>
              ) : (
                <span className="text-warmgray-400 text-xs">No contact number yet</span>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}