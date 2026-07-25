import Header from "@/components/Header";
import { LegalHeading, LegalParagraph, LegalMeta } from "@/components/LegalText";

export const metadata = {
  title: "Terms of Service — p3dan",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-1">
          Terms of Service
        </h1>
        <LegalMeta>Last updated: July 2026</LegalMeta>

        <LegalParagraph>
          These Terms of Service ("Terms") govern your use of p3dan, a
          platform operated by PrimeLabs ("p3dan," "we," "us," or "our") that
          helps people in Ghana find rooms and apartments to rent. By
          creating an account or using p3dan, you agree to these Terms.
        </LegalParagraph>

        <LegalHeading>1. What p3dan Is</LegalHeading>
        <LegalParagraph>
          p3dan is a listings platform that connects people looking for
          accommodation ("Seekers") with people offering accommodation for
          rent ("Landlords"). p3dan is not a real estate agency, is not a
          party to any lease or rental agreement made between users, and does
          not guarantee the accuracy, availability, or condition of any
          listing.
        </LegalParagraph>
        <LegalParagraph>
          We review listings before they go live to reduce fraudulent or
          duplicate posts, but this review does not constitute a guarantee,
          inspection, or endorsement of any property.
        </LegalParagraph>

        <LegalHeading>2. Eligibility and Accounts</LegalHeading>
        <LegalParagraph>
          You must be at least 18 years old to create an account. You are
          responsible for the accuracy of the information you provide,
          including your name and phone number, and for keeping your account
          credentials secure. One account per person; accounts may not be
          shared or transferred.
        </LegalParagraph>

        <LegalHeading>3. Listings</LegalHeading>
        <LegalParagraph>
          If you post a listing, you confirm that you have the legal right to
          rent out the property described, and that the information provided
          (price, room type, area, lease term, fees, and photos) is accurate
          and not misleading. We reserve the right to remove any listing, or
          suspend any account, that we reasonably believe is fraudulent,
          duplicated, discriminatory, or otherwise violates these Terms.
        </LegalParagraph>

        <LegalHeading>4. Contact Between Users</LegalHeading>
        <LegalParagraph>
          p3dan facilitates contact between Seekers and Landlords, including
          via WhatsApp, a third-party messaging service not owned or operated
          by p3dan. Any conversation, negotiation, viewing, payment, or
          agreement that takes place outside the platform is solely between
          the users involved. p3dan is not responsible for the conduct of any
          user, the content of any external conversation, or any financial
          transaction between users.
        </LegalParagraph>

        <LegalHeading>5. Payments</LegalHeading>
        <LegalParagraph>
          p3dan does not process rent payments, deposits, or any other funds
          exchanged between Seekers and Landlords. All such payments are made
          directly between users, at their own risk. We strongly recommend
          verifying a property and landlord in person before making any
          payment.
        </LegalParagraph>

        <LegalHeading>6. Prohibited Conduct</LegalHeading>
        <LegalParagraph>
          You agree not to: post false or misleading listings; harass,
          threaten, or discriminate against other users; use the platform for
          any unlawful purpose; attempt to circumvent our verification or
          moderation processes; or scrape, copy, or redistribute listing data
          without our permission.
        </LegalParagraph>

        <LegalHeading>7. Content You Submit</LegalHeading>
        <LegalParagraph>
          You retain ownership of the photos, descriptions, and other content
          you upload, but you grant p3dan a license to display, store, and
          distribute that content on the platform for the purpose of
          operating the service.
        </LegalParagraph>

        <LegalHeading>8. Limitation of Liability</LegalHeading>
        <LegalParagraph>
          To the fullest extent permitted by law, p3dan is not liable for any
          loss, damage, dispute, injury, or financial harm arising from a
          lease agreement, property visit, payment, or interaction between
          users. The platform is provided "as is," without warranties of any
          kind.
        </LegalParagraph>

        <LegalHeading>9. Termination</LegalHeading>
        <LegalParagraph>
          We may suspend or terminate your account at any time if we
          reasonably believe you have violated these Terms. You may stop
          using p3dan and request account deletion at any time.
        </LegalParagraph>

        <LegalHeading>10. Changes to These Terms</LegalHeading>
        <LegalParagraph>
          We may update these Terms from time to time. Continued use of
          p3dan after changes take effect constitutes acceptance of the
          revised Terms.
        </LegalParagraph>

        <LegalHeading>11. Governing Law</LegalHeading>
        <LegalParagraph>
          These Terms are governed by the laws of the Republic of Ghana.
        </LegalParagraph>

        <LegalHeading>12. Contact Us</LegalHeading>
        <LegalParagraph>
          If you have questions about these Terms, please reach out through
          the Help & Support section of the p3dan mobile app.
        </LegalParagraph>
      </main>
    </>
  );
}