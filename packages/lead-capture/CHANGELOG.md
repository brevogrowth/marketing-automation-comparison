# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-02

### Added
- Initial release of @brevo/lead-capture
- **Modal Mode** for contextual lead gating
  - `LeadCaptureProvider` - Context provider for modal configuration
  - `LeadGateModal` - Pre-styled modal component
  - `useLeadGate` - Hook for programmatic modal control
- **Form Mode** for inline lead capture
  - `LeadCaptureForm` - Customizable form component
  - `useLeadForm` - Hook for form state management
- **Core Utilities**
  - `isValidEmail` - RFC 5322 compliant email validation
  - `isFreeEmail` - Detection of 55+ free email domains
  - `validateProfessionalEmail` - Combined validation with custom translations
  - `getEmailDomain` - Domain extraction utility
  - `submitLead` - API submission with error handling
- **Multi-language Support**
  - English (en)
  - French (fr)
  - German (de)
  - Spanish (es)
- **Fail-open Pattern** - Network errors don't block user actions
- **LocalStorage Persistence** - Remember captured leads across sessions
- **Theme Customization** - Configurable colors and styling
