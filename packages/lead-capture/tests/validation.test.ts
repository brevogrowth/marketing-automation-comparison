/**
 * Lead Capture Package - Validation Tests
 * Tests for the core validation functions
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isFreeEmail,
  validateProfessionalEmail,
  getEmailDomain,
  DEFAULT_FREE_EMAIL_DOMAINS,
} from '../src/core/validation';

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
  });

  it('should handle edge cases', () => {
    expect(isValidEmail(null as unknown as string)).toBe(false);
    expect(isValidEmail(undefined as unknown as string)).toBe(false);
    expect(isValidEmail(123 as unknown as string)).toBe(false);
    expect(isValidEmail('  user@domain.com  ')).toBe(true); // trimmed
  });

  it('should accept short but valid emails', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
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

describe('validateProfessionalEmail', () => {
  it('should return null for valid professional emails', () => {
    const result = validateProfessionalEmail('user@company.com', true);
    expect(result).toBeNull();
  });

  it('should return error message for invalid email format', () => {
    const result = validateProfessionalEmail('notanemail', true);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should return error message for free emails when blocking is enabled', () => {
    const result = validateProfessionalEmail('user@gmail.com', true);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should return null for free emails when blocking is disabled', () => {
    const result = validateProfessionalEmail('user@gmail.com', false);
    expect(result).toBeNull();
  });

  it('should respect custom blocked domains', () => {
    const result = validateProfessionalEmail('user@custom.com', true, ['custom.com']);
    expect(result).toBeTruthy();
  });

  it('should use custom translations when provided', () => {
    const customTranslations = {
      invalidEmailError: 'Custom invalid message',
      freeEmailError: 'Custom free email message',
    };
    const result = validateProfessionalEmail('notanemail', true, [], customTranslations);
    expect(result).toBe('Custom invalid message');
  });
});

describe('DEFAULT_FREE_EMAIL_DOMAINS', () => {
  it('should contain common providers', () => {
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('gmail.com');
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('yahoo.com');
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('hotmail.com');
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('outlook.com');
  });

  it('should contain international providers', () => {
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('orange.fr');
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('web.de');
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('free.fr');
  });

  it('should contain disposable email providers', () => {
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('tempmail.com');
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('guerrillamail.com');
    expect(DEFAULT_FREE_EMAIL_DOMAINS).toContain('mailinator.com');
  });
});
