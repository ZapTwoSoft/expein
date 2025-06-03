-- Sample categories for expenses
INSERT INTO categories (name, icon, color, type) VALUES
  ('Food & Dining', '🍔', '#ef4444', 'expense'),
  ('Transportation', '🚗', '#3b82f6', 'expense'),
  ('Shopping', '🛍️', '#8b5cf6', 'expense'),
  ('Utilities', '💡', '#eab308', 'expense'),
  ('Entertainment', '🎬', '#06b6d4', 'expense'),
  ('Healthcare', '🏥', '#10b981', 'expense'),
  ('Education', '📚', '#f59e0b', 'expense'),
  ('Travel', '✈️', '#6366f1', 'expense');

-- Sample categories for income
INSERT INTO categories (name, icon, color, type) VALUES
  ('Salary', '💼', '#10b981', 'income'),
  ('Business Income', '🏢', '#3b82f6', 'income'),
  ('Freelancing', '💻', '#8b5cf6', 'income'),
  ('Investment Returns', '📈', '#ef4444', 'income'),
  ('Rental Income', '🏠', '#f59e0b', 'income'),
  ('Side Hustle', '🎯', '#06b6d4', 'income'),
  ('Gifts & Bonuses', '🎁', '#ec4899', 'income'),
  ('Other Income', '💰', '#6b7280', 'income'); 