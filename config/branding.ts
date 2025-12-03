/**
 * Branding Configuration
 *
 * This file contains all brand-specific configuration for the marketing asset.
 * When creating a new project from this template, update these values to match
 * the new brand.
 */

export const branding = {
  /** Company/Brand name */
  name: 'Brevo',

  /** Project tagline */
  tagline: 'Marketing KPI Benchmark',

  /** Color palette */
  colors: {
    /** Primary brand color (Brevo green) */
    primary: '#00925D',
    /** Dark variant for hover states */
    primaryDark: '#007A4D',
    /** Secondary color (dark navy) */
    secondary: '#0B1221',
    /** Accent color for highlights */
    accent: '#0068FF',
    /** Light/white for backgrounds */
    light: '#FFFFFF',
  },

  /** Logo assets */
  logo: {
    /** White logo for dark backgrounds */
    white: '/brevo-logo-white.png',
    /** Dark logo for light backgrounds */
    dark: '/brevo-logo-dark.png',
    /** Favicon */
    favicon: '/favicon.ico',
  },

  /** Important URLs */
  links: {
    /** Main website */
    website: 'https://www.brevo.com',
    /** Demo request page (enterprise contact) */
    demo: 'https://www.brevo.com/enterprise/contact-us/',
    /** Privacy policy */
    privacy: 'https://www.brevo.com/legal/privacypolicy/',
    /** Free trial signup */
    trial: 'https://onboarding.brevo.com/account/register',
  },

  /** Partner logos shown in the header/footer */
  partners: [
    { name: 'Cartelis', logo: '/cartelis-logo.svg', url: '#' },
    { name: 'Epsilon', logo: '/epsilon-logo.svg', url: '#' },
    { name: 'Niji', logo: '/niji-logo.svg', url: '#' },
  ],

  /** Social media links */
  social: {
    linkedin: 'https://www.linkedin.com/company/brevo/',
    twitter: 'https://twitter.com/braborora',
    github: 'https://github.com/brevo',
  },
} as const;

/** Type for the branding configuration */
export type Branding = typeof branding;

/** Type for partner objects */
export type Partner = typeof branding.partners[number];
