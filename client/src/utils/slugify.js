/**
 * Convert a product name into a URL-safe slug.
 * "SEED-IOT Kit"        → "seed-iot-kit"
 * "OAIBOX™"             → "oaibox"
 * "GEN TRI — Sovereign AI" → "gen-tri-sovereign-ai"
 * "5G Private Network"  → "5g-private-network"
 */
export function slugify(name = '') {
  return name
    .toLowerCase()
    .replace(/[™®©℠]/g, '')          // strip trademark symbols
    .replace(/[—–]/g, '-')           // em/en dash → hyphen
    .replace(/[^a-z0-9]+/g, '-')     // anything else non-alphanumeric → hyphen
    .replace(/(^-|-$)/g, '');        // trim leading/trailing hyphens
}
