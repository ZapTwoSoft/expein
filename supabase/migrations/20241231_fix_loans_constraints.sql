-- Fix loans table constraints to match application code

-- Drop existing check constraints if they exist
ALTER TABLE loans DROP CONSTRAINT IF EXISTS loans_loan_type_check;
ALTER TABLE loans DROP CONSTRAINT IF EXISTS loans_status_check;

-- Add check constraints with correct values
ALTER TABLE loans ADD CONSTRAINT loans_loan_type_check 
  CHECK (loan_type IN ('given', 'taken'));

ALTER TABLE loans ADD CONSTRAINT loans_status_check 
  CHECK (status IN ('active', 'paid', 'partially_paid'));

