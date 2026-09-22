/**
 * Generates a clean, concise conversation title from the user's first query.
 * Picks the first 5-6 words, strips markdown/special punctuation, and capitalizes.
 */
export function generateConversationTitle(query?: string): string {
  if (!query || typeof query !== "string") {
    return "New Chat";
  }

  // Remove markdown symbols, special chars, and redundant whitespace
  const cleaned = query
    .replace(/[#*`_~>[\](){}"'?!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "New Chat";
  }

  // Pick first 6 words
  const words = cleaned.split(" ").filter(Boolean);
  const picked = words.slice(0, 6).join(" ");

  // Capitalize the first letter
  const formatted = picked.charAt(0).toUpperCase() + picked.slice(1);

  return formatted.length > 45 ? `${formatted.slice(0, 42)}...` : formatted;
}
