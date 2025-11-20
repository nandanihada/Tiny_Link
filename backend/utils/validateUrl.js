/**
 * Validate URL format (must be http or https)
 * @param {string} urlString - URL to validate
 * @returns {boolean} True if valid
 */
function validateUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = { validateUrl };
