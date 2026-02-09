import { CONTACT_INFO } from '../constants/contact';

/**
 * Opens a WhatsApp chat with a prefilled message in a new tab
 * @param message - The message to prefill in WhatsApp
 */
export function openWhatsAppChat(message: string): void {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Generates a WhatsApp URL with a prefilled message
 * @param message - The message to prefill in WhatsApp
 * @returns The complete WhatsApp URL
 */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
