// Centralized contact information for Rajdhani Beej Bhandar
export const CONTACT_INFO = {
  shopName: 'Rajdhani Beej Bhandar',
  phone: '8077036783',
  phoneFormatted: '+91 8077036783',
  whatsappNumber: '918077036783', // Format for wa.me (country code + number, no spaces/symbols)
  address: 'Ganj Daranagar, Bijnor, Uttar Pradesh, India',
  googleMapsLink: 'https://maps.app.goo.gl/1nXnfAyBe6BFAnA87',
  // Embed URL using place query format - works reliably with the address
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.8!2d78.13!3d29.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390be3e6c6c6c6c7%3A0x1234567890abcdef!2sRajdhani%20Beej%20Bhandar!5e0!3m2!1sen!2sin!4v1234567890',
  // Fallback embed using address query (more reliable)
  googleMapsEmbedUrlFallback: 'https://www.google.com/maps?q=Rajdhani+Beej+Bhandar,+Ganj+Daranagar,+Bijnor,+Uttar+Pradesh,+India&output=embed',
} as const;
