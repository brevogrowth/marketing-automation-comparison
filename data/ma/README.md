# Marketing Automation Vendor Data

This folder contains the source CSV files for the Marketing Automation Comparison tool.

## Data Files

### `vendors.csv` - Main Vendor Data

One row per vendor. Required columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `vendor_id` | string | Yes | Unique slug (e.g., "brevo", "klaviyo") |
| `name` | string | Yes | Display name |
| `logo_path` | string | Yes | Path to logo (e.g., "/logos/brevo.svg") |
| `website_url` | string | Yes | Vendor website |
| `short_description` | string | Yes | 1-2 sentence description |
| `long_description` | string | No | Detailed description |
| `target_segments` | string | Yes | Pipe-separated: "SMB\|MM\|ENT" |
| `complexity` | string | Yes | "light", "medium", or "heavy" |
| `g2_rating` | number | Yes | G2 rating (0-5) |
| `g2_reviews_count` | number | Yes | Number of G2 reviews |
| `g2_url` | string | Yes | G2 profile URL |
| `g2_last_checked` | string | Yes | ISO date of last verification |
| `capterra_rating` | number | Yes | Capterra rating (0-5) |
| `capterra_reviews_count` | number | Yes | Number of Capterra reviews |
| `capterra_url` | string | Yes | Capterra profile URL |
| `capterra_last_checked` | string | Yes | ISO date of last verification |
| `pricing_model` | string | Yes | "contacts", "events", "seats", "messages", "hybrid", "custom" |
| `starting_price_bucket` | string | Yes | "low", "medium", "high", "enterprise", "unknown" |
| `pricing_notes` | string | No | Additional pricing info |
| `strength_tags` | string | Yes | Pipe-separated tags (e.g., "ease-of-use\|value\|support") |
| `weakness_tags` | string | Yes | Pipe-separated tags |
| `industries` | string | No | Pipe-separated industries where vendor excels |
| `supported_goals` | string | No | Pipe-separated goals (Acquisition, Retention, etc.) |
| `integrations` | string | No | Pipe-separated key integrations |
| `last_updated` | string | Yes | ISO date of last data update |
| `is_brevo` | string | No | "true" for Brevo only |

### `vendor_features.csv` - Feature Matrix

Long format (one row per vendor+feature). Required columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `vendor_id` | string | Yes | References vendors.csv |
| `category` | string | Yes | Feature category |
| `feature` | string | Yes | Feature name |
| `level` | string | Yes | "full", "partial", "limited", "none" |
| `notes` | string | No | Additional notes |

**Feature Categories:**
- Email Marketing
- SMS Marketing
- Push Notifications
- WhatsApp
- In-App Messaging
- Automation
- Segmentation
- Personalization
- Analytics
- Integrations
- AI Features
- Deliverability
- Support
- Compliance

### `vendor_feedback.csv` - User Feedback Themes

Synthesized pros/cons (NOT verbatim reviews). Required columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `vendor_id` | string | Yes | References vendors.csv |
| `type` | string | Yes | "pro" or "con" |
| `theme` | string | Yes | Theme name (e.g., "Ease of Use") |
| `description` | string | Yes | Brief description |
| `weight` | number | No | Frequency weight 1-5 (5 = most common) |
| `source_url` | string | No | Attribution URL |

## Generated Output

The build script generates `generated/vendors.json` which merges all CSV data into a single JSON file with the structure:

```json
[
  {
    "vendor_id": "brevo",
    "name": "Brevo",
    "features": [...],
    "feedback": [...],
    ...
  }
]
```

## Updating Data

1. Edit the CSV files in this folder
2. Run `npm run generate:ma` to regenerate JSON
3. Test locally with `npm run dev`
4. Commit changes (CSV files are version controlled)

## Google Sheets Sync

For collaborative editing, you can sync from Google Sheets:

1. Create a Google Sheet with the same columns
2. Set `MA_SHEET_ID` environment variable
3. Run `npm run sync:ma-sheets` (GitHub Action available)

## Legal Notes

- Do NOT copy verbatim user reviews from G2/Capterra
- Use synthesized themes + counts + links only
- Always include source URLs for attribution
- Update `last_checked` dates regularly
