import Link from "next/link";
import PinIcon from "@/components/PinIcon";

export default function SuspendedPage() {
  return (
    <main className="max-w-md mx-auto px-6 py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-coral-400 flex items-center justify-center mx-auto mb-5">
        <PinIcon size={22} color="#EDE7DC" />
      </div>
      <h1 className="font-heading font-bold text-2xl mb-2">
        Account suspended
      </h1>
      <p className="text-warmgray-600 mb-8">
        Your account has been suspended. If you believe this is a mistake,
        please reach out through the Help & Support section of the p3dan
        mobile app.
      </p>
      <Link
        href="/"
        className="bg-teal-600 text-canvas rounded-xl px-6 py-3 font-medium hover:bg-teal-800 transition-colors inline-block"
      >
        Back to home
      </Link>
    </main>
  );
}