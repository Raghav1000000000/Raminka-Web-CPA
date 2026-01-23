-- Create contacts table for the contact form
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_requests table for the tax form
CREATE TABLE IF NOT EXISTS tax_requests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    province TEXT NOT NULL,
    tax_year TEXT NOT NULL,
    employment_status TEXT NOT NULL,
    documents_ready BOOLEAN DEFAULT false,
    support_needed BOOLEAN DEFAULT false,
    notes TEXT,
    uploaded_file_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on both tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_requests ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: Drop any existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow public inserts on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated reads on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public inserts on tax_requests" ON tax_requests;
DROP POLICY IF EXISTS "Allow authenticated reads on tax_requests" ON tax_requests;

-- Create policies to allow anonymous inserts (for the contact and tax forms)
-- This is what fixes the RLS error
CREATE POLICY "Allow public inserts on contacts" ON contacts
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public inserts on tax_requests" ON tax_requests
    FOR INSERT 
    WITH CHECK (true);

-- Create policies to allow only authenticated users to view data (for admin)
CREATE POLICY "Allow authenticated reads on contacts" ON contacts
    FOR SELECT 
    USING (auth.jwt() IS NOT NULL);

CREATE POLICY "Allow authenticated reads on tax_requests" ON tax_requests
    FOR SELECT 
    USING (auth.jwt() IS NOT NULL);