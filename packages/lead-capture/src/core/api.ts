import type { LeadData } from './types';

const DEFAULT_TIMEOUT = 5000; // 5 seconds
const FAILED_LEADS_KEY = 'lead_capture_failed';
const MAX_STORED_LEADS = 10;

/**
 * Detects browser language
 */
function detectLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supported = ['en', 'fr', 'de', 'es'];

  return supported.includes(browserLang) ? browserLang : 'en';
}

/**
 * Stores a failed lead to localStorage for later retry
 */
function storeFailedLead(data: LeadData): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const stored = localStorage.getItem(FAILED_LEADS_KEY);
    const leads: LeadData[] = stored ? JSON.parse(stored) : [];

    // Prevent duplicates based on email
    const exists = leads.some((lead) => lead.email === data.email);
    if (!exists) {
      leads.push(data);
      // Keep only the most recent leads
      const trimmed = leads.slice(-MAX_STORED_LEADS);
      localStorage.setItem(FAILED_LEADS_KEY, JSON.stringify(trimmed));
    }
  } catch (error) {
    console.error('[lead-capture] Failed to store lead:', error);
  }
}

/**
 * Retrieves failed leads from localStorage
 */
function getFailedLeads(): LeadData[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FAILED_LEADS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clears stored failed leads
 */
function clearFailedLeads(): void {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.removeItem(FAILED_LEADS_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Retries sending all failed leads stored in localStorage
 * Call this on app initialization or when network becomes available
 */
export async function retryFailedLeads(endpoint: string): Promise<void> {
  const leads = getFailedLeads();
  if (leads.length === 0) return;

  const remaining: LeadData[] = [];

  for (const lead of leads) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        remaining.push(lead);
      }
    } catch {
      remaining.push(lead);
    }
  }

  // Update storage with leads that still failed
  if (remaining.length > 0) {
    localStorage.setItem(FAILED_LEADS_KEY, JSON.stringify(remaining));
  } else {
    clearFailedLeads();
  }
}

/**
 * Sends lead data to the webhook endpoint
 * Fail-open: On error, we don't block the user but store the lead for retry
 */
export async function submitLead(
  endpoint: string,
  data: Omit<LeadData, 'source'> & { source?: Partial<LeadData['source']> }
): Promise<{ success: boolean; error?: string }> {
  // Enrich with metadata
  const enrichedData: LeadData = {
    ...data,
    timestamp: data.timestamp || new Date().toISOString(),
    language: data.language || detectLanguage(),
    source: {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...data.source,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[lead-capture] Webhook error:', response.status);
      // Store for retry
      storeFailedLead(enrichedData);
      // Fail-open: return success anyway
      return { success: true, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('[lead-capture] Network error:', error);
    // Store for retry
    storeFailedLead(enrichedData);
    // Fail-open: don't block the user
    return { success: true, error: String(error) };
  }
}
