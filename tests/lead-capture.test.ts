/**
 * Lead Capture Module - Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isFreeEmail,
  validateLeadEmail,
  getEmailDomain,
} from '../lib/lead-capture/validation';

describe('isValidEmail', () => {
  it('should accept valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@company.co.uk')).toBe(true);
    expect(isValidEmail('first.last@subdomain.domain.org')).toBe(true);
    expect(isValidEmail('user+tag@domain.com')).toBe(true);
    expect(isValidEmail('user123@domain.io')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
    expect(isValidEmail('user space@domain.com')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(isValidEmail(null as unknown as string)).toBe(false);
    expect(isValidEmail(undefined as unknown as string)).toBe(false);
    expect(isValidEmail(123 as unknown as string)).toBe(false);
    expect(isValidEmail('  user@domain.com  ')).toBe(true); // trimmed
  });

  it('should reject emails that are too long', () => {
    const longEmail = 'a'.repeat(250) + '@test.com';
    expect(isValidEmail(longEmail)).toBe(false); // too long (> 254 chars)
  });

  it('should accept short but valid emails', () => {
    expect(isValidEmail('a@b.co')).toBe(true); // short but valid
  });
});

describe('isFreeEmail', () => {
  it('should identify common free email providers', () => {
    expect(isFreeEmail('user@gmail.com')).toBe(true);
    expect(isFreeEmail('user@yahoo.com')).toBe(true);
    expect(isFreeEmail('user@hotmail.com')).toBe(true);
    expect(isFreeEmail('user@outlook.com')).toBe(true);
    expect(isFreeEmail('user@icloud.com')).toBe(true);
    expect(isFreeEmail('user@protonmail.com')).toBe(true);
  });

  it('should identify French free email providers', () => {
    expect(isFreeEmail('user@orange.fr')).toBe(true);
    expect(isFreeEmail('user@free.fr')).toBe(true);
    expect(isFreeEmail('user@sfr.fr')).toBe(true);
    expect(isFreeEmail('user@laposte.net')).toBe(true);
    expect(isFreeEmail('user@wanadoo.fr')).toBe(true);
  });

  it('should identify German free email providers', () => {
    expect(isFreeEmail('user@gmx.de')).toBe(true);
    expect(isFreeEmail('user@web.de')).toBe(true);
    expect(isFreeEmail('user@t-online.de')).toBe(true);
  });

  it('should allow professional email domains', () => {
    expect(isFreeEmail('user@company.com')).toBe(false);
    expect(isFreeEmail('user@brevo.com')).toBe(false);
    expect(isFreeEmail('user@enterprise.io')).toBe(false);
    expect(isFreeEmail('contact@startup.fr')).toBe(false);
  });

  it('should support custom blocked domains', () => {
    expect(isFreeEmail('user@custom-free.com')).toBe(false);
    expect(isFreeEmail('user@custom-free.com', ['custom-free.com'])).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(isFreeEmail('User@GMAIL.COM')).toBe(true);
    expect(isFreeEmail('USER@Gmail.Com')).toBe(true);
  });

  it('should handle invalid input gracefully', () => {
    expect(isFreeEmail('')).toBe(false);
    expect(isFreeEmail(null as unknown as string)).toBe(false);
    expect(isFreeEmail('notanemail')).toBe(false);
  });
});

describe('getEmailDomain', () => {
  it('should extract domain from valid email', () => {
    expect(getEmailDomain('user@example.com')).toBe('example.com');
    expect(getEmailDomain('test@sub.domain.co.uk')).toBe('sub.domain.co.uk');
  });

  it('should return empty string for invalid input', () => {
    expect(getEmailDomain('')).toBe('');
    expect(getEmailDomain('notanemail')).toBe('');
    expect(getEmailDomain(null as unknown as string)).toBe('');
  });

  it('should lowercase the domain', () => {
    expect(getEmailDomain('User@EXAMPLE.COM')).toBe('example.com');
  });
});

describe('validateLeadEmail', () => {
  it('should accept valid professional emails', () => {
    const result = validateLeadEmail('user@company.com', true);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject invalid email format', () => {
    const result = validateLeadEmail('notanemail', true);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('invalid');
  });

  it('should reject free emails when blocking is enabled', () => {
    const result = validateLeadEmail('user@gmail.com', true);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('free');
  });

  it('should accept free emails when blocking is disabled', () => {
    const result = validateLeadEmail('user@gmail.com', false);
    expect(result.isValid).toBe(true);
  });

  it('should respect custom blocked domains', () => {
    const result = validateLeadEmail('user@custom.com', true, ['custom.com']);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('free');
  });

  it('should check format before checking domain', () => {
    // Invalid format should return 'invalid', not 'free'
    const result = validateLeadEmail('gmail.com', true);
    expect(result.error).toBe('invalid');
  });
});

describe('Lead Capture Integration', () => {
  it('should have all required translation keys', async () => {
    const en = await import('../lib/lead-capture/translations/en.json');
    const fr = await import('../lib/lead-capture/translations/fr.json');
    const de = await import('../lib/lead-capture/translations/de.json');
    const es = await import('../lib/lead-capture/translations/es.json');

    const requiredKeys = [
      'title',
      'description',
      'emailLabel',
      'emailPlaceholder',
      'submitButton',
      'loadingButton',
      'freeEmailError',
      'invalidEmailError',
      'networkError',
      'successMessage',
      'legalText',
    ];

    for (const key of requiredKeys) {
      expect(en).toHaveProperty(key);
      expect(fr).toHaveProperty(key);
      expect(de).toHaveProperty(key);
      expect(es).toHaveProperty(key);
    }
  });

  it('should not have empty translation values', async () => {
    const translations = [
      await import('../lib/lead-capture/translations/en.json'),
      await import('../lib/lead-capture/translations/fr.json'),
      await import('../lib/lead-capture/translations/de.json'),
      await import('../lib/lead-capture/translations/es.json'),
    ];

    for (const trans of translations) {
      for (const [key, value] of Object.entries(trans.default || trans)) {
        expect(value, `Translation key "${key}" should not be empty`).toBeTruthy();
        expect(typeof value).toBe('string');
        expect((value as string).length).toBeGreaterThan(0);
      }
    }
  });
});
