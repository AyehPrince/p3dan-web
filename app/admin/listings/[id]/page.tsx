import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchAdminListingDetail } from "@/lib/admin";
import PinIcon from "@/components/PinIcon";
import AdminListingActions from "@/components/AdminListingActions";
import BackButton from "@/components/BackButton";

const paymentLabels: Record<string, string> = {
  full_upfront: "Full amount upfront",
  installments: "Installments negotiable",
};

const statusColors: Record<string, string> = {
  pending: "bg-warmgray-100 text-warmgray-700",
  active: "bg-teal-100 text-teal-900",
  rejected: "bg-coral-100 text-coral-800",
  rented: "bg-coral-100 text-coral-800",
};

export default async function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await fetchAdminListingDetail(id);

  if (!listing) {
    notFound();
  }

  return (
    <div>
      <BackButton label="← Back to listings" />

      <div className="flex items-start justify-between mb-1">
        <h1 className="font-heading font-bold text-2xl">{listing.title}</h1>
        <div className="flex gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusColors[listing.status]}`}>
            {listing.status}
          </span>
          {listing.verified && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900">
              verified
            </span>
          )}
        </div>
      </div>
      <p className="text-coral-600 font-medium mb-6">
        GHS {listing.price.toLocaleString()}/mo
      </p>

      {listing.images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {listing.images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-warmgray-100">
              <Image
                src={url}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-48 rounded-xl bg-warmgray-100 flex items-center justify-center mb-8">
          <PinIcon size={26} color="#B4B2A9" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-canvas-card border border-warmgray-100 rounded-xl p-4">
          <p className="text-warmgray-400 text-xs mb-1">Room type</p>
          <p className="font-medium text-sm">{listing.room_type_name}</p>
        </div>
        <div className="bg-canvas-card border border-warmgray-100 rounded-xl p-4">
          <p className="text-warmgray-400 text-xs mb-1">Area</p>
          <p className="font-medium text-sm">{listing.area_name}, {listing.city}</p>
        </div>
        <div className="bg-canvas-card border border-warmgray-100 rounded-xl p-4">
          <p className="text-warmgray-400 text-xs mb-1">Lease term</p>
          <p className="font-medium text-sm">{listing.lease_term_years} {listing.lease_term_years === 1 ? "year" : "years"}</p>
        </div>
        <div className="bg-canvas-card border border-warmgray-100 rounded-xl p-4">
          <p className="text-warmgray-400 text-xs mb-1">Payment structure</p>
          <p className="font-medium text-sm">{paymentLabels[listing.payment_structure] || listing.payment_structure}</p>
        </div>
      </div>

      {listing.description && (
        <>
          <h2 className="font-medium mb-2">Description</h2>
          <p className="text-warmgray-600 text-sm mb-8">{listing.description}</p>
        </>
      )}

      <h2 className="font-medium mb-2">Landlord</h2>
      <div className="bg-canvas-card border border-warmgray-100 rounded-xl p-4 text-sm mb-8">
        <p>{listing.owner_name || "No name on file"}</p>
        <p className="text-warmgray-600">{listing.owner_phone || "No phone number on file"}</p>
      </div>

      <AdminListingActions
        listingId={listing.id}
        currentStatus={listing.status}
        verified={listing.verified}
      />
    </div>
  );
}