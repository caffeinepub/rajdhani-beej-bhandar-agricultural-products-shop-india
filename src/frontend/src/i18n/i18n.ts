export type SupportedLanguage = 
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'kn'
  | 'gu'
  | 'mr'
  | 'pa'
  | 'bn';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

type TranslationKey = string;
type Translations = Record<SupportedLanguage, Record<TranslationKey, string>>;

const translations: Translations = {
  en: {
    'app.title': 'Agricultural Products Shop',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'footer.admin': 'Admin Login',
    'categories.title': 'Product Categories',
    'category.pesticide': 'Pesticides',
    'category.herbicide': 'Herbicides',
    'category.insecticide': 'Insecticides',
    'category.fungicide': 'Fungicides',
    'category.plantGrowthRegulator': 'Plant Growth Regulators',
    'category.seed': 'Seeds',
    'products.title': 'Our Products',
    'products.filter': 'Filter by Category',
    'products.all': 'All Products',
    'products.loading': 'Loading products...',
    'products.error': 'Failed to load products',
    'products.empty': 'No products found',
    'product.price': 'Price',
    'product.stock': 'In Stock',
    'product.minOrder': 'Minimum Order',
    'product.orderNow': 'Order Now',
    'product.viewDetails': 'View Details',
    'product.description': 'Description',
    'order.title': 'Place Your Order',
    'order.description': 'Choose your preferred ordering method',
    'order.website': 'Order via Website',
    'order.websiteDesc': 'Complete your order through our secure checkout',
    'order.whatsapp': 'Order via WhatsApp',
    'order.whatsappDesc': 'Chat with us directly on WhatsApp',
    'order.bulk': 'Bulk Order (Coming in Phase 2)',
    'order.bulkDesc': 'Special pricing for large quantities',
    'checkout.title': 'Checkout',
    'checkout.name': 'Full Name',
    'checkout.mobile': 'Mobile Number',
    'checkout.address': 'Full Address',
    'checkout.city': 'City',
    'checkout.state': 'State',
    'checkout.pincode': 'Pincode',
    'checkout.quantity': 'Quantity',
    'checkout.total': 'Total Amount',
    'checkout.submit': 'Place Order',
    'checkout.success': 'Order placed successfully!',
    'checkout.error': 'Failed to place order',
    'contact.title': 'Contact Us',
    'contact.location': 'Our Location',
    'contact.openMap': 'Open in Google Maps',
    'admin.dashboard': 'Admin Dashboard',
    'admin.products': 'Product Manager',
    'admin.orders': 'Order Management',
    'admin.planned': 'Planned Features',
    'admin.logout': 'Logout',
    'admin.login': 'Login',
    'admin.welcome': 'Welcome, Admin',
    'loading': 'Loading...',
    'error': 'Error',
    'retry': 'Retry',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
    'close': 'Close',
  },
  hi: {},
  ta: {},
  te: {},
  kn: {},
  gu: {},
  mr: {},
  pa: {},
  bn: {},
};

export function getTranslation(key: TranslationKey, language: SupportedLanguage): string {
  return translations[language]?.[key] || translations[DEFAULT_LANGUAGE][key] || key;
}

export function getCurrentLanguage(): SupportedLanguage {
  const stored = localStorage.getItem('app-language');
  if (stored && SUPPORTED_LANGUAGES.some(l => l.code === stored)) {
    return stored as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
}

export function setCurrentLanguage(language: SupportedLanguage): void {
  localStorage.setItem('app-language', language);
}

export function hasSeenLanguageModal(): boolean {
  return localStorage.getItem('language-modal-seen') === 'true';
}

export function markLanguageModalSeen(): void {
  localStorage.setItem('language-modal-seen', 'true');
}
