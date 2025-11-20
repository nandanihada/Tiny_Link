/**
 * Format database row to API response (snake_case to camelCase)
 * @param {object} row - Database row
 * @param {string} baseUrl - Base URL for shortUrl
 * @returns {object} Formatted response
 */
function formatLinkResponse(row, baseUrl) {
  return {
    id: row.id,
    code: row.code,
    originalUrl: row.original_url,
    clickCount: row.click_count || 0,
    lastClickedAt: row.last_clicked_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    shortUrl: `${baseUrl}/${row.code}`
  };
}

module.exports = { formatLinkResponse };
