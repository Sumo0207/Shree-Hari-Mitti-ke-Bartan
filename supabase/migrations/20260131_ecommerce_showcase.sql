-- Add price and stock_status to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'made_to_order'));

-- Create guides table
CREATE TABLE IF NOT EXISTS public.guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('usage', 'care', 'benefit', 'blog')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for Guides
-- Public read access
CREATE POLICY "Allow public read access on guides" ON public.guides
    FOR SELECT USING (true);

-- Admin full access (assuming admin role check function exists as seen in types.ts)
CREATE POLICY "Allow admin full access on guides" ON public.guides
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.user_roles WHERE role = 'admin'
    ));

-- Policies for Inquiries
-- Public insert access (anyone can enquire)
CREATE POLICY "Allow public insert on inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- Admin read/update access
CREATE POLICY "Allow admin read access on inquiries" ON public.inquiries
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM public.user_roles WHERE role = 'admin'
    ));

CREATE POLICY "Allow admin update access on inquiries" ON public.inquiries
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM public.user_roles WHERE role = 'admin'
    ));
