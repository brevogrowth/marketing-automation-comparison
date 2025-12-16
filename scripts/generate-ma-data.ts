#!/usr/bin/env npx tsx
/**
 * Marketing Automation Data Generator
 *
 * Reads CSV files from data/ma/ and generates a merged JSON file
 * at data/ma/generated/vendors.json
 *
 * Usage: npm run generate:ma
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';
import { z } from 'zod';

// =============================================================================
// PATHS
// =============================================================================

const DATA_DIR = join(process.cwd(), 'data', 'ma');
const OUTPUT_DIR = join(DATA_DIR, 'generated');
const OUTPUT_FILE = join(OUTPUT_DIR, 'vendors.json');

// =============================================================================
// ZOD SCHEMAS FOR VALIDATION
// =============================================================================

const CompanySizeSchema = z.enum(['SMB', 'MM', 'ENT']);
const ComplexitySchema = z.enum(['light', 'medium', 'heavy']);
const FeatureLevelSchema = z.enum(['full', 'partial', 'limited', 'none']);
const PricingModelSchema = z.enum(['contacts', 'events', 'seats', 'messages', 'hybrid', 'custom']);
const PriceBucketSchema = z.enum(['low', 'medium', 'high', 'enterprise', 'unknown']);
const FeedbackTypeSchema = z.enum(['pro', 'con']);

const ReviewSourceSchema = z.object({
  rating: z.number().min(0).max(5),
  reviews_count: z.number().min(0),
  url: z.string().url().or(z.literal('')), // Allow empty string for vendors without G2/Capterra profiles
  last_checked: z.string(),
});

const VendorFeatureSchema = z.object({
  category: z.string(),
  feature: z.string(),
  level: FeatureLevelSchema,
  notes: z.string().optional(),
});

const VendorFeedbackSchema = z.object({
  type: FeedbackTypeSchema,
  theme: z.string(),
  description: z.string(),
  weight: z.number().optional(),
  source_url: z.string().optional(),
});

const VendorSchema = z.object({
  vendor_id: z.string().min(1),
  name: z.string().min(1),
  logo_path: z.string(),
  website_url: z.string().url(),
  short_description: z.string(),
  long_description: z.string().optional(),
  target_segments: z.array(CompanySizeSchema),
  complexity: ComplexitySchema,
  g2: ReviewSourceSchema,
  capterra: ReviewSourceSchema,
  pricing_model: PricingModelSchema,
  starting_price_bucket: PriceBucketSchema,
  pricing_notes: z.string().optional(),
  strength_tags: z.array(z.string()),
  weakness_tags: z.array(z.string()),
  industries: z.array(z.string()).optional(),
  supported_goals: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  features: z.array(VendorFeatureSchema),
  feedback: z.array(VendorFeedbackSchema),
  last_updated: z.string(),
  is_brevo: z.boolean().optional(),
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse pipe-separated string into array
 */
function parsePipeSeparated(value: string | undefined): string[] {
  if (!value || value.trim() === '') return [];
  return value.split('|').map((s) => s.trim()).filter(Boolean);
}

/**
 * Parse number with fallback
 */
function parseNumber(value: string | undefined, fallback: number = 0): number {
  if (!value || value.trim() === '') return fallback;
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Parse boolean from string
 */
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Read and parse a CSV file
 */
function readCsv<T>(filename: string): T[] {
  const filepath = join(DATA_DIR, filename);

  if (!existsSync(filepath)) {
    console.warn(`⚠️  File not found: ${filename} (will use empty array)`);
    return [];
  }

  const content = readFileSync(filepath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true, // Handle UTF-8 BOM
  });

  console.log(`📄 Read ${records.length} rows from ${filename}`);
  return records as T[];
}

// =============================================================================
// CSV ROW TYPES
// =============================================================================

interface VendorCsvRow {
  vendor_id: string;
  name: string;
  logo_path: string;
  website_url: string;
  short_description: string;
  long_description?: string;
  target_segments: string;
  complexity: string;
  g2_rating: string;
  g2_reviews_count: string;
  g2_url: string;
  g2_last_checked: string;
  capterra_rating: string;
  capterra_reviews_count: string;
  capterra_url: string;
  capterra_last_checked: string;
  pricing_model: string;
  starting_price_bucket: string;
  pricing_notes?: string;
  strength_tags: string;
  weakness_tags: string;
  industries?: string;
  supported_goals?: string;
  integrations?: string;
  last_updated: string;
  is_brevo?: string;
}

interface FeatureCsvRow {
  vendor_id: string;
  category: string;
  feature: string;
  level: string;
  notes?: string;
}

interface FeedbackCsvRow {
  vendor_id: string;
  type: string;
  theme: string;
  description: string;
  weight?: string;
  source_url?: string;
}

// =============================================================================
// MAIN GENERATION LOGIC
// =============================================================================

function generateVendorData() {
  console.log('\n🚀 Starting MA vendor data generation...\n');

  // Read CSV files
  const vendorRows = readCsv<VendorCsvRow>('vendors.csv');
  const featureRows = readCsv<FeatureCsvRow>('vendor_features.csv');
  const feedbackRows = readCsv<FeedbackCsvRow>('vendor_feedback.csv');

  if (vendorRows.length === 0) {
    console.log('\n⚠️  No vendors found in vendors.csv');
    console.log('📝 Creating empty vendors.json (add vendors.csv to generate data)\n');
    writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  // Group features by vendor_id
  const featuresByVendor = new Map<string, typeof featureRows>();
  for (const row of featureRows) {
    const existing = featuresByVendor.get(row.vendor_id) || [];
    existing.push(row);
    featuresByVendor.set(row.vendor_id, existing);
  }

  // Group feedback by vendor_id
  const feedbackByVendor = new Map<string, typeof feedbackRows>();
  for (const row of feedbackRows) {
    const existing = feedbackByVendor.get(row.vendor_id) || [];
    existing.push(row);
    feedbackByVendor.set(row.vendor_id, existing);
  }

  // Transform vendor rows
  const vendors = [];
  const errors: string[] = [];

  for (const row of vendorRows) {
    try {
      // Get features for this vendor
      const vendorFeatures = (featuresByVendor.get(row.vendor_id) || []).map((f) => ({
        category: f.category,
        feature: f.feature,
        level: f.level as 'full' | 'partial' | 'limited' | 'none',
        notes: f.notes || undefined,
      }));

      // Get feedback for this vendor
      const vendorFeedback = (feedbackByVendor.get(row.vendor_id) || []).map((f) => ({
        type: f.type as 'pro' | 'con',
        theme: f.theme,
        description: f.description,
        weight: f.weight ? parseNumber(f.weight) : undefined,
        source_url: f.source_url || undefined,
      }));

      // Build vendor object
      const vendor = {
        vendor_id: row.vendor_id,
        name: row.name,
        logo_path: row.logo_path,
        website_url: row.website_url,
        short_description: row.short_description,
        long_description: row.long_description || undefined,
        target_segments: parsePipeSeparated(row.target_segments) as ('SMB' | 'MM' | 'ENT')[],
        complexity: row.complexity as 'light' | 'medium' | 'heavy',
        g2: {
          rating: parseNumber(row.g2_rating),
          reviews_count: parseNumber(row.g2_reviews_count),
          url: row.g2_url,
          last_checked: row.g2_last_checked,
        },
        capterra: {
          rating: parseNumber(row.capterra_rating),
          reviews_count: parseNumber(row.capterra_reviews_count),
          url: row.capterra_url,
          last_checked: row.capterra_last_checked,
        },
        pricing_model: row.pricing_model as 'contacts' | 'events' | 'seats' | 'messages' | 'hybrid' | 'custom',
        starting_price_bucket: row.starting_price_bucket as 'low' | 'medium' | 'high' | 'enterprise' | 'unknown',
        pricing_notes: row.pricing_notes || undefined,
        strength_tags: parsePipeSeparated(row.strength_tags),
        weakness_tags: parsePipeSeparated(row.weakness_tags),
        industries: row.industries ? parsePipeSeparated(row.industries) : undefined,
        supported_goals: row.supported_goals ? parsePipeSeparated(row.supported_goals) : undefined,
        integrations: row.integrations ? parsePipeSeparated(row.integrations) : undefined,
        features: vendorFeatures,
        feedback: vendorFeedback,
        last_updated: row.last_updated,
        is_brevo: parseBoolean(row.is_brevo) || undefined,
      };

      // Validate with Zod
      const validated = VendorSchema.parse(vendor);
      vendors.push(validated);

      console.log(`✅ ${row.name} (${vendorFeatures.length} features, ${vendorFeedback.length} feedback items)`);
    } catch (error) {
      const message = error instanceof z.ZodError
        ? error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        : String(error);
      errors.push(`❌ ${row.vendor_id}: ${message}`);
    }
  }

  // Report errors
  if (errors.length > 0) {
    console.log('\n⚠️  Validation errors:');
    errors.forEach((e) => console.log(`   ${e}`));
  }

  // Write output
  writeFileSync(OUTPUT_FILE, JSON.stringify(vendors, null, 2));

  console.log('\n📊 Summary:');
  console.log(`   Total vendors: ${vendors.length}`);
  console.log(`   Total features: ${featureRows.length}`);
  console.log(`   Total feedback: ${feedbackRows.length}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`\n✨ Output: ${OUTPUT_FILE}\n`);
}

// =============================================================================
// RUN
// =============================================================================

try {
  generateVendorData();
} catch (error) {
  console.error('\n❌ Generation failed:', error);
  process.exit(1);
}
