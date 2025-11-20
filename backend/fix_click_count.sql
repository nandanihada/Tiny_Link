-- Fix for Click Count Issue

-- Step 1: Update existing links with NULL click_count to 0
UPDATE links 
SET click_count = 0 
WHERE click_count IS NULL;

-- Step 2: Ensure the column has a default value
ALTER TABLE links 
ALTER COLUMN click_count SET DEFAULT 0;

-- Step 3: Make click_count NOT NULL
ALTER TABLE links 
ALTER COLUMN click_count SET NOT NULL;

-- Verify the fix
SELECT code, click_count, last_clicked_at 
FROM links 
ORDER BY created_at DESC 
LIMIT 10;
