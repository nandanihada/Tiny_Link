/**
 * Generate a random alphanumeric code
 * @param {number} length - Length of the code (default: 7)
 * @returns {string} Random code
 */
function generateCode(length = 7) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate code format (6-8 alphanumeric characters)
 * @param {string} code - Code to validate
 * @returns {boolean} True if valid
 */
function validateCode(code) {
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  return codeRegex.test(code);
}

module.exports = { generateCode, validateCode };
