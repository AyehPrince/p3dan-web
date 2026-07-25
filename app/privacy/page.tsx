import Header from "@/components/Header";
import { LegalHeading, LegalParagraph, LegalMeta } from "@/components/LegalText";

export const metadata = {
  title: "Privacy Policy — p3dan",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-1">
          Privacy Policy
        </h1>
        <LegalMeta>Last updated: July 2026</LegalMeta>

        <LegalParagraph>
          This Privacy Policy explains how p3dan, operated by PrimeLabs,
          collects, uses, and protects your information. We process personal
          data in accordance with Ghana's Data Protection Act, 2012 (Act
          843).
        </LegalParagraph>

        <LegalHeading>1. Information We Collect</LegalHeading>
        <LegalParagraph>
          Account information: your name, email address, and phone number.
          Listing information: if you post a listing, the property details,
          location, and photos you provide. Usage information: your saved
          favorites, alerts, and general activity on the platform. We do not
          collect precise GPS location automatically — listing locations are
          based on the area you or a landlord selects.
        </LegalParagraph>

        <LegalHeading>2. How We Use Your Information</LegalHeading>
        <LegalParagraph>
          We use your information to operate the platform: showing you
          listings, letting landlords post and manage properties, sending
          notifications about listing approvals or new matches, and allowing
          Seekers to contact Landlords. We do not use your data for automated
          decision-making that produces legal effects, and we do not sell
          your personal data to third parties.
        </LegalParagraph>

        <LegalHeading>3. Sharing Your Information</LegalHeading>
        <LegalParagraph>
          If you are a Landlord, your name and phone number are visible to
          Seekers viewing your listing, so they can contact you. If a Seeker
          chooses to message you, your phone number is used to open a
          WhatsApp conversation — this hands off to WhatsApp, a separate
          service with its own privacy practices. We use Supabase, a
          third-party infrastructure provider, and Google Places, a location
          data provider, to operate core features; neither uses your data for
          their own purposes beyond providing these services to us.
        </LegalParagraph>

        <LegalHeading>4. Data Storage and Security</LegalHeading>
        <LegalParagraph>
          Your data is stored on secure servers with access controls limiting
          who can view or modify it. While we take reasonable steps to
          protect your information, no system is completely secure, and we
          cannot guarantee absolute security.
        </LegalParagraph>

        <LegalHeading>5. Your Rights</LegalHeading>
        <LegalParagraph>
          Under Ghana's Data Protection Act, you have the right to access the
          personal data we hold about you, request correction of inaccurate
          data, request deletion of your account and associated data, and
          object to certain uses of your data. You can exercise most of
          these directly within the app (editing your profile, deleting
          listings) or by contacting us through Help & Support.
        </LegalParagraph>

        <LegalHeading>6. Data Retention</LegalHeading>
        <LegalParagraph>
          We retain your account information for as long as your account is
          active. If you delete your account, we remove your personal
          information within a reasonable period, except where retention is
          required by law.
        </LegalParagraph>

        <LegalHeading>7. Children's Privacy</LegalHeading>
        <LegalParagraph>
          p3dan is not intended for use by anyone under the age of 18, and we
          do not knowingly collect data from minors.
        </LegalParagraph>

        <LegalHeading>8. Changes to This Policy</LegalHeading>
        <LegalParagraph>
          We may update this Privacy Policy from time to time. We'll notify
          you of material changes on the platform.
        </LegalParagraph>

        <LegalHeading>9. Contact Us</LegalHeading>
        <LegalParagraph>
          For questions about this Privacy Policy or to exercise your data
          rights, please reach out through the Help & Support section of the
          p3dan mobile app.
        </LegalParagraph>
      </main>
    </>
  );
}