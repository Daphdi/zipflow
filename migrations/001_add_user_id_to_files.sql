-- First, add user_id column without NOT NULL constraint
ALTER TABLE files
ADD COLUMN user_id VARCHAR(255) AFTER content;

-- Create a default user if not exists
INSERT INTO users (id, name, email, password)
SELECT 'default_user', 'Default User', 'default@example.com', 'default_password'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'default_user');

-- Update existing files to use the default user
UPDATE files SET user_id = 'default_user' WHERE user_id IS NULL;

-- Now add NOT NULL constraint
ALTER TABLE files
MODIFY COLUMN user_id VARCHAR(255) NOT NULL;

-- Add foreign key constraint
ALTER TABLE files
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add index for faster queries
CREATE INDEX idx_files_user_id ON files(user_id); 