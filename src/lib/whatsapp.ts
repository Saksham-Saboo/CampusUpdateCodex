// Central WhatsApp config — used by floating button & exit-intent popup.
export const WHATSAPP_NUMBER = "918435868053"; // +91 84358 68053
export const WHATSAPP_DEFAULT_MSG =
  "Hi CampusUpdates! I'd like free MBA counselling.";

export function waLink(message?: string, number: string = WHATSAPP_NUMBER) {
  const text = encodeURIComponent(message || WHATSAPP_DEFAULT_MSG);
  return `https://wa.me/${number}?text=${text}`;
}
