import { z } from 'zod';

// Input validation schema
export const chatInputSchema = z.object({
  message: z.string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long")
    .refine(
      (msg) => !containsBlockedWords(msg),
      "Message contains inappropriate content"
    ),
  contextId: z.string().uuid().optional(),
  mode: z.enum(["learning", "casual", "exam"]),
  ageGroup: z.enum(["child", "teen", "adult"]),
});

export type ChatInput = z.infer<typeof chatInputSchema>;

// Content safety checks
const blockedWords = [
  "password",
  "ssn",
  "credit card",
  // Add more blocked words/patterns
];

export function containsBlockedWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return blockedWords.some(word => lowerText.includes(word));
}

// Response validation
export function validateAIResponse(response: string): boolean {
  // Check response length
  if (response.length > 2000) return false;
  
  // Check for blocked content
  if (containsBlockedWords(response)) return false;
  
  // Add more validation rules as needed
  return true;
}

// Age-appropriate content filtering
export function filterContentForAge(content: string, ageGroup: string): string {
  switch (ageGroup) {
    case "child":
      // Apply strict content filtering for children
      return content
        .replace(/complex|difficult|advanced/gi, "challenging")
        .replace(/\b(death|kill|hurt)\b/gi, "stop");
    case "teen":
      // Moderate content filtering for teens
      return content
        .replace(/explicit|graphic/gi, "detailed");
    default:
      return content;
  }
}

// Rate limiting helper
export const RATE_LIMITS = {
  child: { maxRequests: 20, timeWindow: 3600 }, // 20 requests per hour
  teen: { maxRequests: 30, timeWindow: 3600 },  // 30 requests per hour
  adult: { maxRequests: 50, timeWindow: 3600 }, // 50 requests per hour
} as const;