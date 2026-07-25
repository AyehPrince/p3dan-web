import Link from "next/link";
import Header from "@/components/Header";
import PinIcon from "@/components/PinIcon";

export default function ListPropertySuccessPage() {
  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-5">
          <PinIcon size={22} color="#EDE7DC" />
        </div>
        <h1 className="font-heading font-bold text-2xl mb-2">
          Listing submitted
        </h1>
        <p className="text-warmgray-600 mb-8">
          Your listing is pending review. Once approved, it&apos;ll appear on
          p3dan for everyone to see.
        </p>
        <Link
          href="/"
          className="bg-teal-600 text-canvas rounded-xl px-6 py-3 font-medium hover:bg-teal-800 transition-colors inline-block"
        >
          Back to home
        </Link>
      </main>
    </>
  );
}