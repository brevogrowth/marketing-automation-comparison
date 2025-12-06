/**
 * Domain Normalization Utilities
 *
 * Normalizes domain strings for consistent database keys.
 */

/**
 * Normalize a domain string for consistent storage and lookup
 *
 * Processing steps:
 * 1. Remove protocol (http://, https://)
 * 2. Remove path and query parameters
 * 3. Remove www. prefix
 * 4. Convert to lowercase
 * 5. Trim whitespace
 *
 * @example
 * normalizeDomain('HTTPS://WWW.EXAMPLE.COM/path?query=1') // 'example.com'
 * normalizeDomain('example.co.uk') // 'example.co.uk'
 * normalizeDomain('www.domain.fr') // 'domain.fr'
 */
export function normalizeDomain(domain: string): string {
  if (!domain) return '';

  let normalized = domain;

  // Remove protocol (http://, https://)
  normalized = normalized.replace(/^https?:\/\//, '');

  // Remove path and query parameters
  normalized = normalized.replace(/\/.*$/, '');

  // Remove www. prefix
  normalized = normalized.replace(/^www\./, '');

  // Convert to lowercase
  normalized = normalized.toLowerCase();

  // Trim whitespace
  normalized = normalized.trim();

  return normalized;
}

/**
 * Check if a domain string is likely valid
 * Basic validation: at least 4 chars and contains a dot
 */
export function isDomainLikelyValid(domain: string): boolean {
  if (!domain) return false;
  const normalized = normalizeDomain(domain);
  return normalized.length >= 4 && normalized.includes('.');
}

/**
 * Extract company name from domain
 * Takes the first part of the domain (before the first dot)
 * and capitalizes the first letter
 */
export function extractCompanyNameFromDomain(domain: string): string {
  if (!domain) return 'Unknown Company';

  const normalized = normalizeDomain(domain);
  const name = normalized.split('.')[0];

  if (!name) return 'Unknown Company';

  return name.charAt(0).toUpperCase() + name.slice(1);
}
