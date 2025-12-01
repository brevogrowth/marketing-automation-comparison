// Liste des domaines email gratuits à bloquer
export const DEFAULT_FREE_EMAIL_DOMAINS = [
  // International
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'hotmail.com',
  'hotmail.fr',
  'hotmail.de',
  'hotmail.es',
  'outlook.com',
  'outlook.fr',
  'outlook.de',
  'outlook.es',
  'live.com',
  'live.fr',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'proton.me',
  'tutanota.com',
  'zoho.com',
  'yandex.com',
  'yandex.ru',
  'mail.com',
  'gmx.com',
  'gmx.de',
  'gmx.fr',

  // France
  'orange.fr',
  'wanadoo.fr',
  'free.fr',
  'sfr.fr',
  'laposte.net',
  'bbox.fr',
  'numericable.fr',

  // Germany
  'web.de',
  't-online.de',
  'freenet.de',

  // Spain
  'telefonica.es',

  // Temporary/Disposable
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
];

/**
 * Valide le format d'un email
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  // Regex RFC 5322 simplifiée
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Vérifie si l'email est d'un domaine gratuit
 */
export function isFreeEmail(
  email: string,
  customBlockedDomains: string[] = []
): boolean {
  if (!isValidEmail(email)) return false;

  const domain = email.trim().toLowerCase().split('@')[1];
  const allBlockedDomains = [...DEFAULT_FREE_EMAIL_DOMAINS, ...customBlockedDomains];

  return allBlockedDomains.includes(domain);
}

/**
 * Valide un email professionnel
 * Retourne un message d'erreur ou null si valide
 */
export function validateProfessionalEmail(
  email: string,
  blockFreeEmails: boolean = true,
  customBlockedDomains: string[] = [],
  translations?: { invalidEmailError?: string; freeEmailError?: string }
): string | null {
  if (!isValidEmail(email)) {
    return translations?.invalidEmailError || 'Please enter a valid email address';
  }

  if (blockFreeEmails && isFreeEmail(email, customBlockedDomains)) {
    return translations?.freeEmailError || 'Please use your professional email address';
  }

  return null;
}
