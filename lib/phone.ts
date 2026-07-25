export function toWhatsAppNumber(rawPhone: string): string | null {
  if (!rawPhone) return null;
  const digitsOnly = rawPhone.replace(/\D/g, "");

  if (digitsOnly.startsWith("233")) {
    return digitsOnly;
  }
  if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
    return "233" + digitsOnly.slice(1);
  }
  if (digitsOnly.length === 9) {
    return "233" + digitsOnly;
  }
  return digitsOnly;
}

export function buildWhatsAppLink(rawPhone: string, message: string): string | null {
  const number = toWhatsAppNumber(rawPhone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}