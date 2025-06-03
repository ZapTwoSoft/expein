-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read categories
CREATE POLICY "Allow authenticated users to read categories" ON "public"."categories"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- Allow only admin to insert, update, delete categories
CREATE POLICY "Allow admin to manage categories" ON "public"."categories"
AS PERMISSIVE FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'alkemy48@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'alkemy48@gmail.com'); 