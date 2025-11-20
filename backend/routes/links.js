const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generateCode } = require('../utils/generateCode');
const { formatLinkResponse } = require('../utils/formatResponse');
const { validateLinkCreation } = require('../middleware/validation');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * POST /api/links - Create a new short link
 */
router.post('/', validateLinkCreation, async (req, res, next) => {
  const { originalUrl, customCode } = req.body;

  try {
    let code = customCode;

    // Generate random code if not provided
    if (!code) {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        code = generateCode();
        const checkResult = await pool.query(
          'SELECT code FROM links WHERE code = $1',
          [code]
        );

        if (checkResult.rows.length === 0) {
          break;
        }
        attempts++;
      }

      if (attempts === maxAttempts) {
        return res.status(500).json({
          error: 'Could not generate unique code',
          code: 'GENERATION_FAILED'
        });
      }
    } else {
      // Check if custom code already exists
      const checkResult = await pool.query(
        'SELECT code FROM links WHERE code = $1',
        [code]
      );

      if (checkResult.rows.length > 0) {
        return res.status(409).json({
          error: 'Code already exists',
          code: 'CODE_EXISTS'
        });
      }
    }

    // Insert new link
    const result = await pool.query(
      `INSERT INTO links (code, original_url) 
       VALUES ($1, $2) 
       RETURNING *`,
      [code, originalUrl]
    );

    const link = formatLinkResponse(result.rows[0], BASE_URL);
    res.status(201).json(link);

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/links - Get all links with pagination
 */
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;
    const sort = req.query.sort || 'recent';

    // Determine sort order
    const orderBy = sort === 'popular' 
      ? 'click_count DESC, created_at DESC' 
      : 'created_at DESC';

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM links');
    const total = parseInt(countResult.rows[0].count);

    // Get links
    const result = await pool.query(
      `SELECT * FROM links 
       ORDER BY ${orderBy} 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const links = result.rows.map(row => formatLinkResponse(row, BASE_URL));

    res.json({
      links,
      total,
      limit,
      offset
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/links/:code - Get link statistics
 */
router.get('/:code', async (req, res, next) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM links WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Link not found',
        code: 'NOT_FOUND'
      });
    }

    const link = formatLinkResponse(result.rows[0], BASE_URL);
    res.json(link);

  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/links/:code - Delete a link
 */
router.delete('/:code', async (req, res, next) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM links WHERE code = $1 RETURNING code',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Link not found',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      message: 'Link deleted successfully',
      code: result.rows[0].code
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
