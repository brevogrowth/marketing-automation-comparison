// List of free email domains to block
export const DEFAULT_FREE_EMAIL_DOMAINS = [
  // International - Google
  'gmail.com',
  'googlemail.com',

  // International - Yahoo
  'yahoo.com',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'yahoo.co.uk',
  'yahoo.it',
  'yahoo.ca',
  'ymail.com',
  'rocketmail.com',

  // International - Microsoft
  'hotmail.com',
  'hotmail.fr',
  'hotmail.de',
  'hotmail.es',
  'hotmail.co.uk',
  'hotmail.it',
  'outlook.com',
  'outlook.fr',
  'outlook.de',
  'outlook.es',
  'outlook.co.uk',
  'live.com',
  'live.fr',
  'live.de',
  'live.co.uk',
  'msn.com',

  // International - Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // International - Other
  'aol.com',
  'protonmail.com',
  'proton.me',
  'tutanota.com',
  'tuta.io',
  'zoho.com',
  'yandex.com',
  'yandex.ru',
  'mail.com',
  'email.com',
  'gmx.com',
  'gmx.de',
  'gmx.fr',
  'gmx.net',
  'fastmail.com',
  'hushmail.com',
  'inbox.com',
  'mail.ru',
  'rediffmail.com',

  // France
  'orange.fr',
  'wanadoo.fr',
  'free.fr',
  'sfr.fr',
  'laposte.net',
  'bbox.fr',
  'numericable.fr',
  'neuf.fr',
  'aliceadsl.fr',
  'club-internet.fr',

  // Germany
  'web.de',
  't-online.de',
  'freenet.de',
  'arcor.de',
  '1und1.de',

  // Spain
  'telefonica.es',
  'terra.es',

  // Italy
  'libero.it',
  'virgilio.it',
  'alice.it',
  'tin.it',
  'tiscali.it',

  // UK
  'btinternet.com',
  'virginmedia.com',
  'sky.com',
  'talktalk.net',

  // Netherlands
  'ziggo.nl',
  'kpnmail.nl',

  // Temporary/Disposable
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'discard.email',
  'sharklasers.com',
  'yopmail.com',
  'getnada.com',
  'maildrop.cc',
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
 * Extracts domain from email address
 * @param email - Email address
 * @returns Domain portion of the email, or empty string if invalid
 */
export function getEmailDomain(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const trimmedEmail = email.trim().toLowerCase();
  const atIndex = trimmedEmail.lastIndexOf('@');

  if (atIndex === -1) {
    return '';
  }

  return trimmedEmail.substring(atIndex + 1);
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
