const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * GET /:code - Redirect to original URL
 */
router.get('/:code', async (req, res, next) => {
  const { code } = req.params;

  try {
    // Get the link
    const result = await pool.query(
      'SELECT original_url FROM links WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Link not found'
      });
    }

    const originalUrl = result.rows[0].original_url;

    // Update click count and last clicked timestamp atomically
    await pool.query(
      `UPDATE links 
       SET click_count = click_count + 1, 
           last_clicked_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE code = $1`,
      [code]
    );

    // Redirect with 302 status
    res.redirect(302, originalUrl);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
