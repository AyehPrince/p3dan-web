import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Help & Support — p3dan",
};

const faqs = [
  {
    question: "How do I search for a place?",
    answer:
      "Use the search bar on the homepage or Browse page to type an area name, like Adenta or Ashaley Botwe. You can also filter by room type and city.",
  },
  {
    question: "What do the room types mean?",
    answer:
      "Room types follow how rentals actually work in Ghana: single room, chamber and hall, self-contain (1, 2, or 3 bedroom), and full house. Landlords can add a custom type if theirs doesn't fit.",
  },
  {
    question: "How do I contact a landlord?",
    answer:
      "Open a listing and tap 'Message on WhatsApp.' This opens a chat with the landlord directly, with a message already filled in mentioning the listing.",
  },
  {
    question: "What does 'verified' mean on a listing?",
    answer:
      "Every listing is reviewed before it goes live. A verified badge means our team has checked the listing details for consistency, but it doesn't replace visiting the property yourself before making any payment.",
  },
  {
    question: "What does 'trusted landlord' mean?",
    answer:
      "This badge is given to landlords our team has additional confidence in, based on their history on the platform. It's a helpful signal, not a guarantee.",
  },
  {
    question: "How do I list my property?",
    answer:
      "Create an account, then go to 'List a property.' Fill in the details, room type, area, price, and lease term, then submit. Your listing goes into review and appears once approved.",
  },
  {
    question: "Why was my listing not approved?",
    answer:
      "It'll show under My Listings with the reason, if one was given. You can edit and resubmit it from there.",
  },
  {
    question: "Does p3dan collect any payment or fees?",
    answer:
      "No. p3dan does not process rent, deposits, or any payments between you and a landlord or tenant. All payments happen directly between users.",
  },
];

export default function HelpPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-1">Help & Support</h1>
        <p className="text-warmgray-600 mb-8">
          Answers to common questions about using p3dan.
        </p>

        <div className="bg-canvas-card border border-warmgray-100 rounded-2xl divide-y divide-warmgray-50 mb-8">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-medium text-sm pr-4">{faq.question}</span>
                <span className="text-warmgray-400 transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <p className="text-warmgray-600 text-sm leading-relaxed mt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="bg-canvas-card border border-warmgray-100 rounded-2xl p-6 text-center">
          <p className="font-medium text-sm mb-1">Still need help?</p>
          <p className="text-warmgray-600 text-sm mb-4">
            Reach out to our support team directly on WhatsApp.
          </p>
          <a
            href="https://wa.me/233548392472?text=Hi%2C%20I%20need%20help%20with%20p3dan."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-600 text-canvas rounded-xl px-6 py-3 font-medium hover:bg-teal-800 transition-colors inline-block"
          >
            Message support
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}