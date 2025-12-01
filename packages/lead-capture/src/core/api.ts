import type { LeadData } from './types';

const DEFAULT_TIMEOUT = 5000; // 5 secondes

/**
 * Détecte la langue du navigateur
 */
function detectLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supported = ['en', 'fr', 'de', 'es'];

  return supported.includes(browserLang) ? browserLang : 'en';
}

/**
 * Envoie les données de lead au webhook
 * Fail-open : en cas d'erreur, on ne bloque pas l'utilisateur
 */
export async function submitLead(
  endpoint: string,
  data: Omit<LeadData, 'source'> & { source?: Partial<LeadData['source']> }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Enrichir avec les métadonnées
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
      // Fail-open : on retourne success quand même
      return { success: true, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('[lead-capture] Network error:', error);
    // Fail-open : on ne bloque pas l'utilisateur
    return { success: true, error: String(error) };
  }
}
