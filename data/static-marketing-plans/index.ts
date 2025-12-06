/**
 * Static Marketing Plans Loader
 *
 * Provides static template plans for each industry.
 * Used for Level 1 (free, no email required) experience.
 */

import type { MarketingPlan } from '../../src/types/marketing-plan';
import type { Industry } from '../../config/industries';

// Import all static plans
// English plans
import fashionEn from './fashion.en.json';
import beautyEn from './beauty.en.json';
import homeEn from './home.en.json';
import electronicsEn from './electronics.en.json';
import foodEn from './food.en.json';
import sportsEn from './sports.en.json';
import luxuryEn from './luxury.en.json';
import familyEn from './family.en.json';
import saasEn from './saas.en.json';
import servicesEn from './services.en.json';
import manufacturingEn from './manufacturing.en.json';
import wholesaleEn from './wholesale.en.json';

// French plans
import fashionFr from './fashion.fr.json';
import beautyFr from './beauty.fr.json';
import homeFr from './home.fr.json';
import electronicsFr from './electronics.fr.json';
import foodFr from './food.fr.json';
import sportsFr from './sports.fr.json';
import luxuryFr from './luxury.fr.json';
import familyFr from './family.fr.json';
import saasFr from './saas.fr.json';
import servicesFr from './services.fr.json';
import manufacturingFr from './manufacturing.fr.json';
import wholesaleFr from './wholesale.fr.json';

/**
 * Supported languages for static plans
 */
export type StaticPlanLanguage = 'en' | 'fr' | 'de' | 'es';

/**
 * Map of all static plans by industry and language
 */
const staticPlans: Record<Industry, Record<StaticPlanLanguage, MarketingPlan>> = {
  // B2C Industries
  Fashion: {
    en: fashionEn as MarketingPlan,
    fr: fashionFr as MarketingPlan,
    de: fashionEn as MarketingPlan, // Fallback to English
    es: fashionEn as MarketingPlan, // Fallback to English
  },
  Beauty: {
    en: beautyEn as MarketingPlan,
    fr: beautyFr as MarketingPlan,
    de: beautyEn as MarketingPlan,
    es: beautyEn as MarketingPlan,
  },
  Home: {
    en: homeEn as MarketingPlan,
    fr: homeFr as MarketingPlan,
    de: homeEn as MarketingPlan,
    es: homeEn as MarketingPlan,
  },
  Electronics: {
    en: electronicsEn as MarketingPlan,
    fr: electronicsFr as MarketingPlan,
    de: electronicsEn as MarketingPlan,
    es: electronicsEn as MarketingPlan,
  },
  Food: {
    en: foodEn as MarketingPlan,
    fr: foodFr as MarketingPlan,
    de: foodEn as MarketingPlan,
    es: foodEn as MarketingPlan,
  },
  Sports: {
    en: sportsEn as MarketingPlan,
    fr: sportsFr as MarketingPlan,
    de: sportsEn as MarketingPlan,
    es: sportsEn as MarketingPlan,
  },
  Luxury: {
    en: luxuryEn as MarketingPlan,
    fr: luxuryFr as MarketingPlan,
    de: luxuryEn as MarketingPlan,
    es: luxuryEn as MarketingPlan,
  },
  Family: {
    en: familyEn as MarketingPlan,
    fr: familyFr as MarketingPlan,
    de: familyEn as MarketingPlan,
    es: familyEn as MarketingPlan,
  },
  // B2B Industries
  SaaS: {
    en: saasEn as MarketingPlan,
    fr: saasFr as MarketingPlan,
    de: saasEn as MarketingPlan,
    es: saasEn as MarketingPlan,
  },
  Services: {
    en: servicesEn as MarketingPlan,
    fr: servicesFr as MarketingPlan,
    de: servicesEn as MarketingPlan,
    es: servicesEn as MarketingPlan,
  },
  Manufacturing: {
    en: manufacturingEn as MarketingPlan,
    fr: manufacturingFr as MarketingPlan,
    de: manufacturingEn as MarketingPlan,
    es: manufacturingEn as MarketingPlan,
  },
  Wholesale: {
    en: wholesaleEn as MarketingPlan,
    fr: wholesaleFr as MarketingPlan,
    de: wholesaleEn as MarketingPlan,
    es: wholesaleEn as MarketingPlan,
  },
};

/**
 * Get a static marketing plan for an industry and language
 *
 * @param industry - The industry to get the plan for
 * @param language - The user's language (defaults to 'en')
 * @returns The static marketing plan, or English fallback if not found
 */
export function getStaticPlan(
  industry: Industry,
  language: string = 'en'
): MarketingPlan {
  const industryPlans = staticPlans[industry];

  if (!industryPlans) {
    // Fallback to Fashion if industry not found
    return staticPlans.Fashion.en;
  }

  // Try exact language match
  const lang = language.toLowerCase().slice(0, 2) as StaticPlanLanguage;
  if (industryPlans[lang]) {
    return industryPlans[lang];
  }

  // Fallback to English
  return industryPlans.en;
}

/**
 * Check if a static plan exists for an industry
 */
export function hasStaticPlan(industry: Industry): boolean {
  return industry in staticPlans;
}

/**
 * Get all available industries with static plans
 */
export function getAvailableIndustries(): Industry[] {
  return Object.keys(staticPlans) as Industry[];
}
