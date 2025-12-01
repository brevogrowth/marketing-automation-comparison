/**
 * Lead Capture Module - Email Validation
 * Validates email format and checks against free email providers
 */

/** Default list of free email domains to block */
const DEFAULT_FREE_EMAIL_DOMAINS = [
  // Global providers
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'yahoo.co.uk',
  'hotmail.com',
  'hotmail.fr',
  'hotmail.de',
  'hotmail.es',
  'hotmail.co.uk',
  'outlook.com',
  'outlook.fr',
  'outlook.de',
  'outlook.es',
  'live.com',
  'live.fr',
  'live.de',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'proton.me',
  'gmx.com',
  'gmx.fr',
  'gmx.de',
  'gmx.net',
  'mail.com',
  'yandex.com',
  'yandex.ru',
  'zoho.com',
  'tutanota.com',
  'fastmail.com',

  // French providers
  'orange.fr',
  'wanadoo.fr',
  'free.fr',
  'sfr.fr',
  'laposte.net',
  'bbox.fr',
  'neuf.fr',
  'numericable.fr',
  'alice.fr',

  // German providers
  'web.de',
  't-online.de',
  'freenet.de',
  'arcor.de',

  // Spanish providers
  'telefonica.es',
  'movistar.es',

  // UK providers
  'btinternet.com',
  'virginmedia.com',
  'sky.com',
];

/**
 * Validates email format using a robust regex pattern
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Check basic length constraints
  if (trimmedEmail.length < 5 || trimmedEmail.length > 254) {
    return false;
  }

  // RFC 5322 compliant email regex (simplified but robust)
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  return emailRegex.test(trimmedEmail);
}

/**
 * Checks if an email belongs to a free email provider
 * @param email - Email address to check
 * @param customDomains - Additional domains to block (merged with default list)
 * @returns true if email is from a free provider
 */
export function isFreeEmail(email: string, customDomains?: string[]): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();
  const atIndex = trimmedEmail.lastIndexOf('@');

  if (atIndex === -1) {
    return false;
  }

  const domain = trimmedEmail.substring(atIndex + 1);

  // Combine default and custom domains
  const blockedDomains = new Set([
    ...DEFAULT_FREE_EMAIL_DOMAINS,
    ...(customDomains?.map(d => d.toLowerCase()) || []),
  ]);

  return blockedDomains.has(domain);
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
 * Validates email for lead capture (format + not free email)
 * @param email - Email to validate
 * @param blockFreeEmails - Whether to block free email providers
 * @param customBlockedDomains - Additional domains to block
 * @returns Object with isValid and error message
 */
export function validateLeadEmail(
  email: string,
  blockFreeEmails: boolean = true,
  customBlockedDomains?: string[]
): { isValid: boolean; error?: 'invalid' | 'free' } {
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'invalid' };
  }

  if (blockFreeEmails && isFreeEmail(email, customBlockedDomains)) {
    return { isValid: false, error: 'free' };
  }

  return { isValid: true };
}
