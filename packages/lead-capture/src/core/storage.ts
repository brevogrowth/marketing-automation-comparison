const DEFAULT_KEY = 'lead_captured';

interface StoredData {
  email: string;
  capturedAt: string;
}

/**
 * Vérifie si un lead a déjà été capturé
 */
export function isLeadCaptured(storageKey: string = DEFAULT_KEY): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(storageKey);
    return stored !== null;
  } catch {
    // localStorage indisponible (private browsing, etc.)
    return false;
  }
}

/**
 * Marque le lead comme capturé
 */
export function markLeadCaptured(
  email: string,
  storageKey: string = DEFAULT_KEY
): void {
  if (typeof window === 'undefined') return;

  try {
    const data: StoredData = {
      email,
      capturedAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // Silently fail
  }
}

/**
 * Récupère les données du lead capturé
 */
export function getCapturedLead(storageKey: string = DEFAULT_KEY): StoredData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Reset le lead capturé (pour debug/test)
 */
export function resetLeadCapture(storageKey: string = DEFAULT_KEY): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Silently fail
  }
}
