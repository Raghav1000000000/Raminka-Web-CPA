# Supabase Setup Guide

## 1. Create Storage Bucket

Go to your Supabase dashboard → Storage → Create bucket:

**Bucket name:** `tax-documents`
**Public bucket:** ✅ Checked
**File size limit:** 5MB
**Allowed MIME types:** `application/pdf,image/jpeg,image/jpg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

## 2. Create Storage Policy

Go to Storage → tax-documents bucket → Policies → New Policy

**Policy for:** INSERT
**Policy name:** `Allow authenticated uploads`
**Policy definition:**
```sql
(bucket_id = 'tax-documents'::text)
```

**Policy for:** SELECT  
**Policy name:** `Allow public access`
**Policy definition:**
```sql
(bucket_id = 'tax-documents'::text)
```

## 3. Create Database Tables

Go to SQL Editor and run:

### Create contacts table:
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone
CREATE POLICY "Allow public inserts" ON contacts
    FOR INSERT WITH CHECK (true);

-- Allow reads for authenticated users
CREATE POLICY "Allow authenticated reads" ON contacts
    FOR SELECT USING (auth.role() = 'authenticated');
```

### Create tax_requests table:
```sql
CREATE TABLE tax_requests (
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

-- Enable RLS
ALTER TABLE tax_requests ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone
CREATE POLICY "Allow public inserts" ON tax_requests
    FOR INSERT WITH CHECK (true);

-- Allow reads for authenticated users
CREATE POLICY "Allow authenticated reads" ON tax_requests
    FOR SELECT USING (auth.role() = 'authenticated');
```

## 4. Test the Setup

After running the SQL commands above, try submitting the forms again. The errors should be resolved.

## Troubleshooting

If you still get errors:
1. Check that bucket name is exactly `tax-documents`
2. Verify the bucket is marked as public
3. Ensure storage policies are created
4. Check table names match exactly: `contacts` and `tax_requests`
5. Verify RLS policies are enabled and allow public inserts