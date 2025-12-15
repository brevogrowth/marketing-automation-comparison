/**
 * Marketing Plan Parser and Validator
 *
 * Handles parsing AI responses into MarketingPlan objects
 * and validates the data structure.
 */

import type {
  MarketingPlan,
  CompanySummary,
  MarketingProgram,
  ValidationError,
  ParsedPlanResult,
} from '../types/marketing-plan';

// Re-export types that are used by API routes
export type { ValidationError } from '../types/marketing-plan';

/**
 * Extract company name from domain
 */
export function extractCompanyName(domain?: string): string {
  if (!domain) return 'Unknown Company';
  const name = domain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Navigate nested objects with multiple path options
 * Returns the first valid path's value
 */
function getNestedValue(
  obj: unknown,
  pathOptions: string[][]
): { value: unknown; path: string[] } {
  for (const path of pathOptions) {
    let current: unknown = obj;
    let valid = true;

    for (const key of path) {
      if (
        current &&
        typeof current === 'object' &&
        current !== null &&
        key in current
      ) {
        current = (current as Record<string, unknown>)[key];
      } else {
        valid = false;
        break;
      }
    }

    if (valid) {
      return { value: current, path };
    }
  }

  return { value: null, path: [] };
}

/**
 * Check if a string has meaningful content
 * Language-agnostic: works for any non-empty, non-placeholder string
 */
export function hasContent(str?: string): boolean {
  if (!str) return false;
  if (str === 'Not specified') return false;
  if (str.trim().length === 0) return false;
  return true;
}

/**
 * Parse company summary from raw data
 */
function parseCompanySummary(data: unknown, domain?: string): CompanySummary {
  // Create fallback summary if data is missing
  if (!data || typeof data !== 'object') {
    return {
      name: extractCompanyName(domain),
      website: domain || 'Unknown',
      activities: 'Not specified',
      target: 'Not specified',
    };
  }

  const raw = data as Record<string, unknown>;

  // Derive name from domain for consistency
  const name = (raw.name as string) || extractCompanyName(domain);
  const website = (raw.website as string) || domain || 'Unknown';

  // Keep original API fields with fallbacks
  const activities =
    (raw.activities as string) || (raw.industry as string) || 'Not specified';
  const target =
    (raw.target as string) || (raw.target_audience as string) || 'Not specified';

  // For backward compatibility
  const industry = (raw.industry as string) || activities;
  const targetAudience = (raw.target_audience as string) || target;

  return {
    name,
    website,
    activities,
    target,
    industry,
    target_audience: targetAudience,
    nb_employees: raw.nb_employees as string | undefined,
    business_model: raw.business_model as string | undefined,
    linkedin_scrape_status: raw.linkedin_scrape_status as string | undefined,
    customer_lifecycle_key_steps: raw.customer_lifecycle_key_steps as
      | string
      | undefined,
  };
}

/**
 * Parse programs list from raw data
 */
function parsePrograms(
  data: unknown,
  allContentData?: Record<string, unknown>
): MarketingProgram[] {
  if (!data) {
    return [];
  }

  let programs: MarketingProgram[] = [];

  // Handle array format
  if (Array.isArray(data)) {
    programs = data.map((program, index) => {
      const p = program as Record<string, unknown>;
      return {
        program_name:
          (p.program_name as string) ||
          (p.name as string) ||
          `Program ${index + 1}`,
        target: (p.target as string) || 'Not specified',
        objective: (p.objective as string) || 'Not specified',
        kpi: (p.kpi as string) || '',
        description: (p.description as string) || '',
        scenarios: p.scenarios as MarketingProgram['scenarios'],
      };
    });
  } else if (typeof data === 'object' && data !== null) {
    // Handle object format
    programs = Object.entries(data as Record<string, unknown>).map(
      ([_, program], index) => {
        const p = program as Record<string, unknown>;
        return {
          program_name:
            (p.program_name as string) ||
            (p.name as string) ||
            `Program ${index + 1}`,
          target: (p.target as string) || 'Not specified',
          objective: (p.objective as string) || 'Not specified',
          kpi: (p.kpi as string) || '',
          description: (p.description as string) || '',
          scenarios: p.scenarios as MarketingProgram['scenarios'],
        };
      }
    );
  }

  // Create placeholder if no programs found
  if (programs.length === 0) {
    programs = [
      {
        program_name: 'Marketing Program',
        target: 'Not specified',
        objective: 'Not specified',
        kpi: '',
        description: 'No program details available',
      },
    ];
  }

  // Check for additional program details in the content object
  if (allContentData && typeof allContentData === 'object') {
    // Extract all program_X_details keys
    const detailsKeys = Object.keys(allContentData)
      .filter((key) => /^program_\d+_details$/.test(key))
      .sort();

    // Assign program details to the correct programs by index
    detailsKeys.forEach((detailKey) => {
      const match = detailKey.match(/^program_(\d+)_details$/);
      if (match && match[1]) {
        const programIndex = parseInt(match[1], 10) - 1; // Convert to 0-based index

        if (programIndex >= 0 && programIndex < programs.length) {
          const details = allContentData[detailKey] as Record<string, unknown>;

          if (details && typeof details === 'object') {
            // Preserve program name from details
            if (details.program_name || details.name) {
              programs[programIndex].program_name =
                (details.program_name as string) || (details.name as string);
            }

            // Preserve scenarios
            if (details.scenarios) {
              programs[programIndex].scenarios =
                details.scenarios as MarketingProgram['scenarios'];
            }
          }
        }
      }
    });
  }

  return programs;
}

/**
 * Parse AI response into MarketingPlan
 */
export function parsePlanData(
  responseData: unknown,
  domain?: string
): MarketingPlan | null {
  try {
    if (!responseData) {
      console.error('[parsePlanData] responseData is null/undefined');
      return null;
    }

    // Debug: Log the incoming data structure
    console.log('[parsePlanData] Input type:', typeof responseData);

    // Helper to extract JSON from string (handles markdown code blocks)
    const extractJSON = (str: string): object | null => {
      // Remove markdown code blocks if present
      let cleaned = str.trim();

      // Try multiple patterns for markdown code blocks
      // Pattern 1: ```json ... ``` (with closing)
      const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        cleaned = jsonBlockMatch[1].trim();
        console.log('[extractJSON] Extracted from markdown block');
      } else {
        // Pattern 2: ```json at start without closing (common AI response pattern)
        const openBlockMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]+)$/);
        if (openBlockMatch && openBlockMatch[1]) {
          cleaned = openBlockMatch[1].trim();
          console.log('[extractJSON] Extracted from open markdown block');
        }
      }

      // Try to find JSON object - use greedy match from first { to last }
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('[extractJSON] Successfully parsed JSON object');
          return parsed;
        } catch (e) {
          console.error('[extractJSON] JSON.parse failed:', e instanceof Error ? e.message : 'Unknown error');
          console.error('[extractJSON] JSON preview (first 500 chars):', jsonMatch[0].substring(0, 500));
          console.error('[extractJSON] JSON preview (last 200 chars):', jsonMatch[0].substring(Math.max(0, jsonMatch[0].length - 200)));

          // Try to repair common JSON issues
          try {
            // Sometimes AI responses have trailing content after JSON
            let jsonStr = jsonMatch[0];

            // Count braces to find the actual end of JSON
            let braceCount = 0;
            let bracketCount = 0;
            let jsonEnd = -1;
            let inString = false;
            let escapeNext = false;

            for (let i = 0; i < jsonStr.length; i++) {
              const char = jsonStr[i];

              if (escapeNext) {
                escapeNext = false;
                continue;
              }

              if (char === '\\') {
                escapeNext = true;
                continue;
              }

              if (char === '"') {
                inString = !inString;
                continue;
              }

              if (inString) continue;

              if (char === '{') braceCount++;
              if (char === '}') {
                braceCount--;
                if (braceCount === 0 && bracketCount === 0) {
                  jsonEnd = i + 1;
                  break;
                }
              }
              if (char === '[') bracketCount++;
              if (char === ']') bracketCount--;
            }

            if (jsonEnd > 0 && jsonEnd < jsonStr.length) {
              jsonStr = jsonStr.substring(0, jsonEnd);
              console.log('[extractJSON] Trimmed JSON to balanced braces');
              const trimmedParsed = JSON.parse(jsonStr);
              console.log('[extractJSON] Successfully parsed trimmed JSON');
              return trimmedParsed;
            }

            // If JSON is truncated (unbalanced braces), try to complete it
            if (braceCount > 0 || bracketCount > 0) {
              console.log(`[extractJSON] JSON appears truncated: ${braceCount} unclosed braces, ${bracketCount} unclosed brackets`);

              // Find last complete field before truncation
              // Look for the last complete key-value pair
              let repairStr = jsonStr;

              // Remove incomplete string at the end (e.g., "linkedin_scrape_statu)
              // Find the last complete property
              const lastCompleteComma = repairStr.lastIndexOf(',\n');
              const lastCompleteBrace = repairStr.lastIndexOf('},');
              const lastCompleteBracket = repairStr.lastIndexOf('],');

              // Find the best truncation point
              let cutPoint = Math.max(lastCompleteComma, lastCompleteBrace, lastCompleteBracket);

              if (cutPoint > repairStr.length * 0.5) { // Only if we're keeping more than 50%
                // Cut at this point and close all open structures
                repairStr = repairStr.substring(0, cutPoint);

                // Remove trailing comma if present
                repairStr = repairStr.replace(/,\s*$/, '');

                // Recount braces/brackets after cutting
                braceCount = 0;
                bracketCount = 0;
                inString = false;
                escapeNext = false;

                for (let i = 0; i < repairStr.length; i++) {
                  const char = repairStr[i];
                  if (escapeNext) { escapeNext = false; continue; }
                  if (char === '\\') { escapeNext = true; continue; }
                  if (char === '"') { inString = !inString; continue; }
                  if (inString) continue;
                  if (char === '{') braceCount++;
                  if (char === '}') braceCount--;
                  if (char === '[') bracketCount++;
                  if (char === ']') bracketCount--;
                }

                // Close any open brackets then braces
                for (let i = 0; i < bracketCount; i++) repairStr += ']';
                for (let i = 0; i < braceCount; i++) repairStr += '}';

                console.log('[extractJSON] Attempting to parse repaired truncated JSON');
                const repairedParsed = JSON.parse(repairStr);
                console.log('[extractJSON] Successfully parsed repaired JSON');
                return repairedParsed;
              }
            }
          } catch (repairError) {
            console.error('[extractJSON] JSON repair failed:', repairError instanceof Error ? repairError.message : 'Unknown');
          }
        }
      }

      // Try direct parse as last resort
      try {
        const directParsed = JSON.parse(cleaned);
        console.log('[extractJSON] Direct parse succeeded');
        return directParsed;
      } catch {
        console.error('[extractJSON] All parsing attempts failed');
        return null;
      }
    };

    if (typeof responseData === 'string') {
      console.log('[parsePlanData] String content (first 500 chars):', responseData.substring(0, 500));
      console.log('[parsePlanData] String length:', responseData.length);
      const parsed = extractJSON(responseData);
      if (parsed) {
        responseData = parsed;
        console.log('[parsePlanData] Parsed string to object with keys:', Object.keys(parsed));
        console.log('[parsePlanData] Has company_summary:', 'company_summary' in parsed);
        console.log('[parsePlanData] Has programs_list:', 'programs_list' in parsed);
      } else {
        console.error('[parsePlanData] Failed to parse string as JSON');
        throw new Error(`Invalid response: received string that is not valid JSON. First 200 chars: ${responseData.substring(0, 200)}`);
      }
    }

    if (typeof responseData === 'object' && responseData !== null) {
      console.log('[parsePlanData] Top-level keys:', Object.keys(responseData as object));

      // Check if response contains a 'text' or 'message' field with JSON string
      const dataObj = responseData as Record<string, unknown>;
      for (const key of ['text', 'message', 'output', 'result', 'data']) {
        if (typeof dataObj[key] === 'string') {
          const nested = extractJSON(dataObj[key] as string);
          if (nested && (nested as Record<string, unknown>).company_summary) {
            console.log(`[parsePlanData] Found JSON in '${key}' field`);
            responseData = nested;
            break;
          }
        }
      }
    }

    // Get content from multiple possible paths
    const { value: content, path: contentPath } = getNestedValue(responseData, [
      ['response', 'data', 'content'],
      ['content'],
      ['response', 'data', 'content', 'json_response'],
      ['content', 'json_response'],
      ['result'],
      ['data'],
      ['output'],
      [], // Direct object
    ]);

    console.log('[parsePlanData] Found content via path:', contentPath.join('.') || 'direct');
    console.log('[parsePlanData] Content type:', typeof content);

    // If content is a string, try to parse it
    let finalContentTemp = content;
    if (typeof content === 'string') {
      const parsed = extractJSON(content);
      if (parsed) {
        finalContentTemp = parsed;
        console.log('[parsePlanData] Parsed content string to object');
      }
    }

    // If no nested path worked, try the response itself
    const finalContent =
      finalContentTemp && typeof finalContentTemp === 'object' ? finalContentTemp : responseData;

    if (!finalContent || typeof finalContent !== 'object') {
      throw new Error('Invalid content structure or missing content');
    }

    const contentObj = finalContent as Record<string, unknown>;

    // Get company summary
    const companySummary = parseCompanySummary(
      contentObj.company_summary,
      domain
    );

    // Get programs list with full content data for details extraction
    const programsList = parsePrograms(contentObj.programs_list, contentObj);

    // Build the marketing plan
    const parsedData: MarketingPlan = {
      company_summary: companySummary,
      programs_list: programsList,
      introduction: (contentObj.introduction as string) || '',
      tools_used: (contentObj.tools_used as string) || '',
      conclusion: (contentObj.conclusion as string) || '',
      how_brevo_helps_you: Array.isArray(contentObj.how_brevo_helps_you)
        ? (contentObj.how_brevo_helps_you as MarketingPlan['how_brevo_helps_you'])
        : [],
    };

    // Store raw content structure for debugging
    parsedData.raw_content_structure = {
      contentKeys: Object.keys(contentObj),
      programDetailKeys: Object.keys(contentObj).filter(
        (k) => k.includes('program_') && k.includes('details')
      ),
      contentPath: contentPath.join('.'),
    };

    // Extract conversation_id if available
    const rawData = responseData as Record<string, unknown>;
    const conversationId =
      (
        (
          (rawData.response as Record<string, unknown>)?.data as Record<
            string,
            unknown
          >
        )?.metadata as Record<string, unknown>
      )?.conversation_id ||
      (rawData.metadata as Record<string, unknown>)?.conversation_id ||
      rawData.conversation_id;

    if (conversationId) {
      parsedData.metadata = {
        ...parsedData.metadata,
        conversation_id: conversationId as string,
      };
    }

    return parsedData;
  } catch (error) {
    console.error('[parsePlanData] Error parsing plan data:', error);
    throw error;
  }
}

/**
 * Validate parsed plan data
 */
export function validatePlanData(
  data: unknown,
  domain?: string
): ParsedPlanResult {
  const errors: ValidationError[] = [];

  try {
    if (!data) {
      errors.push({ field: 'data', message: 'Response data is null or undefined' });
      return { data: null, isValid: false, errors };
    }

    // First, try to parse the data
    let parsedData: MarketingPlan | null = null;

    try {
      parsedData = parsePlanData(data, domain);
    } catch (parseError) {
      errors.push({
        field: 'parsing',
        message:
          parseError instanceof Error
            ? parseError.message
            : 'Unknown parsing error',
      });
      return { data: null, isValid: false, errors };
    }

    if (!parsedData) {
      errors.push({ field: 'parsing', message: 'Failed to parse marketing plan data' });
      return { data: null, isValid: false, errors };
    }

    // Validate company summary
    const summary = parsedData.company_summary || {};

    // Check for meaningful content in activities/industry
    const hasActivities =
      (summary.activities && hasContent(summary.activities)) ||
      (summary.industry && hasContent(summary.industry));

    // Check for meaningful content in target/target_audience
    const hasTarget =
      (summary.target && hasContent(summary.target)) ||
      (summary.target_audience && hasContent(summary.target_audience));

    if (!hasActivities) {
      errors.push({
        field: 'company_summary.activities',
        message:
          'Missing required field: either activities or industry must be provided',
      });
    }

    if (!hasTarget) {
      errors.push({
        field: 'company_summary.target',
        message:
          'Missing required field: either target or target_audience must be provided',
      });
    }

    if (errors.length > 0) {
      return { data: null, isValid: false, errors };
    }

    return { data: parsedData, isValid: true, errors: [] };
  } catch (error) {
    errors.push({
      field: 'validation',
      message:
        error instanceof Error ? error.message : 'Unknown validation error',
    });
    return { data: null, isValid: false, errors };
  }
}

/**
 * Deep clone an object while preserving structure
 * Special handling for program_X_details keys
 */
export function deepStructureClone<T>(data: T): T {
  if (data == null) return data;
  if (typeof data !== 'object') return data;

  // Handle Date instances
  if (data instanceof Date) return new Date(data) as T;

  // Handle Array instances
  if (Array.isArray(data)) {
    return data.map((item) => deepStructureClone(item)) as T;
  }

  // Handle Object instances
  const result: Record<string, unknown> = {};

  Object.keys(data as object).forEach((key) => {
    result[key] = deepStructureClone((data as Record<string, unknown>)[key]);
  });

  return result as T;
}
