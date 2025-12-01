// ============================================
// CONFIGURATION
// ============================================

export interface LeadCaptureConfig {
  /** Endpoint API pour envoyer les données (default: '/api/lead') */
  apiEndpoint?: string;

  /** Clé localStorage pour persister l'état (default: 'lead_captured') */
  storageKey?: string;

  /** Identifiant du projet pour le webhook */
  projectId?: string;

  /** Bloquer les emails gratuits (gmail, yahoo...) (default: true) */
  blockFreeEmails?: boolean;

  /** Domaines supplémentaires à bloquer */
  customBlockedDomains?: string[];

  /** Langue forcée (sinon auto-detect) */
  language?: 'en' | 'fr' | 'de' | 'es';

  /** Override des traductions */
  translations?: Partial<LeadCaptureTranslations>;
}

// ============================================
// MODAL MODE
// ============================================

export interface ModalConfig extends LeadCaptureConfig {
  /** Mode de la modal (default: 'blocking') */
  mode?: 'blocking' | 'passive';
}

export interface TriggerOptions {
  /** Identifiant du trigger (pour analytics) */
  reason: string;

  /** Données contextuelles à envoyer au webhook */
  context?: Record<string, unknown>;

  /** Callback après capture réussie */
  onSuccess: () => void;

  /** Callback si l'utilisateur ferme (mode passive only) */
  onCancel?: () => void;
}

export interface UseLeadGateReturn {
  /** L'utilisateur a-t-il déjà donné son email ? */
  isUnlocked: boolean;

  /** La modal est-elle visible ? */
  isModalOpen: boolean;

  /** Déclenche le gate (ouvre modal si pas unlocked) */
  requireLead: (options: TriggerOptions) => void;

  /** Ferme la modal sans soumettre */
  closeModal: () => void;

  /** Reset l'état (pour debug) */
  reset: () => void;
}

// ============================================
// FORM MODE
// ============================================

export interface CustomField {
  /** Nom du champ (clé dans les données) */
  name: string;

  /** Type d'input */
  type: 'text' | 'email' | 'url' | 'tel' | 'select' | 'textarea';

  /** Label affiché */
  label: string;

  /** Placeholder */
  placeholder?: string;

  /** Champ obligatoire ? (default: false) */
  required?: boolean;

  /** Options pour type 'select' */
  options?: { value: string; label: string }[];

  /** Validation custom (retourne message d'erreur ou null) */
  validation?: (value: string) => string | null;

  /** Valeur par défaut */
  defaultValue?: string;
}

export interface LeadCaptureFormProps extends LeadCaptureConfig {
  /** Champs personnalisés en plus de l'email */
  customFields?: CustomField[];

  /** Callback après soumission réussie */
  onSubmit?: (data: LeadFormData) => void | Promise<void>;

  /** Callback succès */
  onSuccess?: () => void;

  /** Callback erreur */
  onError?: (error: Error) => void;

  /** Texte du bouton submit */
  submitLabel?: string;

  /** Texte du bouton pendant loading */
  loadingLabel?: string;

  /** Layout du formulaire */
  layout?: 'stacked' | 'inline' | 'grid';

  /** Classes CSS custom */
  className?: string;

  /** Classes CSS pour les éléments internes */
  classNames?: {
    form?: string;
    field?: string;
    label?: string;
    input?: string;
    select?: string;
    textarea?: string;
    error?: string;
    button?: string;
    legalText?: string;
  };

  /** Afficher le texte légal ? (default: true) */
  showLegalText?: boolean;
}

export interface UseLeadFormReturn {
  /** Soumet les données */
  submit: (email: string, customFields?: Record<string, string>) => Promise<void>;

  /** État de chargement */
  isSubmitting: boolean;

  /** Erreur éventuelle */
  error: string | null;

  /** Succès */
  isSuccess: boolean;

  /** Reset le formulaire */
  reset: () => void;
}

// ============================================
// DONNÉES
// ============================================

export interface LeadData {
  email: string;
  timestamp: string;
  language: string;
  projectId?: string;
  trigger?: string;
  source: {
    page: string;
    referrer: string;
    userAgent: string;
  };
  context?: Record<string, unknown>;
  customFields?: Record<string, string>;
}

export interface LeadFormData {
  email: string;
  customFields: Record<string, string>;
  timestamp: string;
  language: string;
}

// ============================================
// TRADUCTIONS
// ============================================

export interface LeadCaptureTranslations {
  // Modal
  modalTitle: string;
  modalDescription: string;

  // Form labels
  emailLabel: string;
  emailPlaceholder: string;

  // Buttons
  submitButton: string;
  loadingButton: string;
  closeButton: string;

  // Errors
  invalidEmailError: string;
  freeEmailError: string;
  requiredFieldError: string;
  networkError: string;

  // Success
  successMessage: string;

  // Legal
  legalText: string;
}
