export function sanitizeCssVarToken(id: string) {
  const replaced = id
    .trim()
    // Normalize whitespace to single dash
    .replace(/\s+/g, '-')
    // Replace any character not allowed in CSS custom property names with dash
    // Allowed: letters, digits, underscore, hyphen
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    // Collapse multiple dashes
    .replace(/-+/g, '-')
    // Trim leading/trailing dashes
    .replace(/^-+|-+$/g, '');

  // Prevent starting with a digit to avoid identifier issues (defensive)
  const safe = replaced.length === 0 ? 'id' : /^[0-9]/.test(replaced) ? `x-${replaced}` : replaced;

  return safe;
}
