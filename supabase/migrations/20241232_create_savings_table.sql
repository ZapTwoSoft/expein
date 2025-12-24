-- Create savings table
CREATE TABLE IF NOT EXISTS public.savings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    goal_name TEXT,
    goal_amount NUMERIC(10, 2),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON public.savings(user_id);

-- Create index on date for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_savings_date ON public.savings(date DESC);

-- Enable Row Level Security
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for savings
-- Policy: Users can view their own savings
CREATE POLICY "Users can view own savings"
    ON public.savings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own savings
CREATE POLICY "Users can insert own savings"
    ON public.savings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own savings
CREATE POLICY "Users can update own savings"
    ON public.savings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own savings
CREATE POLICY "Users can delete own savings"
    ON public.savings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_savings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER savings_updated_at
    BEFORE UPDATE ON public.savings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_savings_updated_at();

