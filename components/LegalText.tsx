export function LegalHeading({ children }: { children: string }) {
  return (
    <h2 className="font-heading font-bold text-lg mt-8 mb-2">{children}</h2>
  );
}

export function LegalParagraph({ children }: { children: string }) {
  return (
    <p className="text-warmgray-700 text-sm leading-relaxed mb-3">
      {children}
    </p>
  );
}

export function LegalMeta({ children }: { children: string }) {
  return <p className="text-warmgray-400 text-xs mb-6">{children}</p>;
}