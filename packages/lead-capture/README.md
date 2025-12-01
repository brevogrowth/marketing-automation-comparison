# @brevo/lead-capture

Reusable email capture module for Brevo marketing assets.

## Features

- **Two modes**: Modal (gate) and Form (inline)
- **Professional email validation**: Blocks 50+ free email domains
- **Internationalization**: EN, FR, DE, ES translations
- **Zero dependencies**: Only React as peer dependency
- **TypeScript strict mode**: Full type safety
- **Fail-open pattern**: Network errors don't block users

## Installation

```bash
npm install @brevo/lead-capture
```

## Usage

### Modal Mode (Gate)

```tsx
// app/layout.tsx
import { LeadCaptureProvider } from '@brevo/lead-capture';

export default function RootLayout({ children }) {
  return (
    <LeadCaptureProvider
      config={{
        apiEndpoint: '/api/lead',
        storageKey: 'brevo_kpi_lead',
        projectId: 'kpi-benchmark',
        mode: 'blocking',
        blockFreeEmails: true,
      }}
    >
      {children}
    </LeadCaptureProvider>
  );
}
```

```tsx
// app/page.tsx
import { useLeadGate } from '@brevo/lead-capture';

export default function Home() {
  const { requireLead, isUnlocked } = useLeadGate();

  const handlePremiumAction = () => {
    requireLead({
      reason: 'download_report',
      context: { reportType: 'full' },
      onSuccess: () => {
        // User provided email, proceed with action
        downloadReport();
      },
    });
  };

  return <button onClick={handlePremiumAction}>Download Report</button>;
}
```

### Form Mode (Inline)

```tsx
import { LeadCaptureForm } from '@brevo/lead-capture';

export default function Newsletter() {
  return (
    <LeadCaptureForm
      apiEndpoint="/api/lead"
      projectId="newsletter"
      onSuccess={() => console.log('Subscribed!')}
      customFields={[
        {
          name: 'company',
          type: 'text',
          label: 'Company',
          required: true,
        },
      ]}
      submitLabel="Subscribe"
      layout="stacked"
    />
  );
}
```

## API

### LeadCaptureProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiEndpoint` | `string` | `/api/lead` | Webhook endpoint |
| `storageKey` | `string` | `lead_captured` | localStorage key |
| `projectId` | `string` | - | Project identifier |
| `mode` | `'blocking' \| 'passive'` | `blocking` | Modal behavior |
| `blockFreeEmails` | `boolean` | `true` | Block gmail, yahoo, etc. |
| `language` | `'en' \| 'fr' \| 'de' \| 'es'` | auto | Force language |

### useLeadGate Hook

```ts
const {
  isUnlocked,    // boolean - User has provided email
  isModalOpen,   // boolean - Modal is visible
  requireLead,   // (options) => void - Trigger gate
  closeModal,    // () => void - Close modal (passive only)
  reset,         // () => void - Clear localStorage
} = useLeadGate();
```

### LeadCaptureForm

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customFields` | `CustomField[]` | `[]` | Additional fields |
| `onSubmit` | `(data) => void` | - | Submit callback |
| `onSuccess` | `() => void` | - | Success callback |
| `layout` | `'stacked' \| 'inline'` | `stacked` | Form layout |
| `submitLabel` | `string` | - | Button text |
| `showLegalText` | `boolean` | `true` | Show legal notice |

## License

MIT
