import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PinIcon from "@/components/PinIcon";

export const metadata = {
  title: "About — p3dan",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-5">
          <PinIcon size={28} color="#EDE7DC" />
        </div>
        <h1 className="font-heading font-bold text-2xl mb-1">p3dan</h1>
        <p className="text-warmgray-400 text-xs mb-8">
          Built by PrimeLabs · Accra, Ghana
        </p>

        <p className="text-warmgray-700 text-sm leading-relaxed mb-8">
          p3dan helps people across Ghana find rooms and apartments to rent,
          searchable by the room types and areas that actually match how
          people rent here — without hidden agent fees or wasted trips to see
          a place that isn&apos;t what it seemed.
        </p>

        <div className="bg-canvas-card border border-warmgray-100 rounded-2xl p-6 text-left mb-8">
          <h2 className="font-medium text-sm mb-2">Our approach</h2>
          <p className="text-warmgray-600 text-sm leading-relaxed">
            Every listing is reviewed before it goes live. Fee breakdowns are
            shown upfront. Contact happens directly between you and the
            landlord, with no middleman fees on the platform.
          </p>
        </div>

        <div className="flex justify-center gap-5 text-sm">
          <Link href="/terms" className="text-teal-600 font-medium hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-teal-600 font-medium hover:underline">
            Privacy Policy
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}