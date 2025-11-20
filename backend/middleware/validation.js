const { validateUrl } = require('../utils/validateUrl');
const { validateCode } = require('../utils/generateCode');

/**
 * Validate link creation request
 */
function validateLinkCreation(req, res, next) {
  const { originalUrl, customCode } = req.body;

  // Validate originalUrl
  if (!originalUrl) {
    return res.status(400).json({
      error: 'Original URL is required',
      code: 'INVALID_URL'
    });
  }

  if (!validateUrl(originalUrl)) {
    return res.status(400).json({
      error: 'Invalid URL format',
      code: 'INVALID_URL'
    });
  }

  // Validate customCode if provided
  if (customCode && !validateCode(customCode)) {
    return res.status(400).json({
      error: 'Code must be 6-8 alphanumeric characters',
      code: 'INVALID_CODE'
    });
  }

  next();
}

module.exports = { validateLinkCreation };
