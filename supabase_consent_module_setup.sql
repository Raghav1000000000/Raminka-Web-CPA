-- ============================================
-- SUPABASE CONSENT MODULE - COMPLETE SQL SETUP
-- ============================================
-- Execute this SQL in your Supabase SQL Editor
-- This creates tables, storage buckets, security policies, and functions

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Client Consents Table (Enhanced with signature photo support)
CREATE TABLE IF NOT EXISTS public.client_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    consent_date DATE NOT NULL DEFAULT CURRENT_DATE,
    signature_data TEXT, -- Base64 encoded canvas signature
    signature_photo_url TEXT, -- URL to uploaded signature photo
    signature_type TEXT NOT NULL DEFAULT 'draw' CHECK (signature_type IN ('draw', 'upload')),
    ip_address INET,
    user_agent TEXT,
    consent_type TEXT NOT NULL DEFAULT 'tax_service_agreement',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Contacts Table (for contact form submissions)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'spam')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_consents_email ON public.client_consents(client_email);
CREATE INDEX IF NOT EXISTS idx_client_consents_date ON public.client_consents(consent_date);
CREATE INDEX IF NOT EXISTS idx_client_consents_type ON public.client_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_client_consents_status ON public.client_consents(status);
CREATE INDEX IF NOT EXISTS idx_client_consents_created_at ON public.client_consents(created_at);

-- Add indexes for contacts table
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- bcrypt hashed password
    full_name TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for admin users
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);

-- Consent Analytics Table (for tracking form usage)
CREATE TABLE IF NOT EXISTS public.consent_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'form_view', 'form_start', 'form_submit', 'signature_draw', 'signature_upload'
    consent_id UUID REFERENCES public.client_consents(id) ON DELETE SET NULL,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    page_url TEXT,
    referrer TEXT,
    metadata JSONB, -- Additional data like form field interactions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for analytics
CREATE INDEX IF NOT EXISTS idx_consent_analytics_event_type ON public.consent_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_consent_analytics_consent_id ON public.consent_analytics(consent_id);
CREATE INDEX IF NOT EXISTS idx_consent_analytics_created_at ON public.consent_analytics(created_at);

-- ============================================
-- 2. CREATE STORAGE BUCKET FOR SIGNATURES
-- ============================================

-- Create storage bucket for signature photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'signatures',
    'signatures',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.client_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Client Consents Policies
-- Allow public to insert new consent forms
CREATE POLICY "Anyone can insert consent forms" ON public.client_consents
    FOR INSERT WITH CHECK (true);

-- Allow public to view their own consent (by email)
CREATE POLICY "Users can view own consent" ON public.client_consents
    FOR SELECT USING (true); -- For now, allow all reads (can be restricted later)

-- Only admins can update/delete
CREATE POLICY "Admins can update consents" ON public.client_consents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Admins can delete consents" ON public.client_consents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );

-- Admin Users Policies
-- Only existing admins can view admin users
CREATE POLICY "Admins can view admin users" ON public.admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );

-- Only super admins can modify admin users
CREATE POLICY "Super admins can modify admin users" ON public.admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND role = 'super_admin' AND is_active = TRUE
        )
    );

-- Analytics Policies
-- Allow public to insert analytics
CREATE POLICY "Anyone can insert analytics" ON public.consent_analytics
    FOR INSERT WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics" ON public.consent_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );

-- Contacts Policies
-- Allow public to insert contact forms
CREATE POLICY "Anyone can insert contacts" ON public.contacts
    FOR INSERT WITH CHECK (true);

-- Only admins can view contact forms
CREATE POLICY "Admins can view contacts" ON public.contacts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );

-- Only admins can update contact status
CREATE POLICY "Admins can update contacts" ON public.contacts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );

-- ============================================
-- 4. STORAGE POLICIES
-- ============================================

-- Allow public to upload signature photos
CREATE POLICY "Anyone can upload signatures" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'signatures');

-- Allow public to view signature photos
CREATE POLICY "Anyone can view signatures" ON storage.objects
    FOR SELECT USING (bucket_id = 'signatures');

-- Only admins can delete signature photos
CREATE POLICY "Admins can delete signatures" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'signatures' AND
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );

-- ============================================
-- 5. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_client_consents_updated_at 
    BEFORE UPDATE ON public.client_consents 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON public.admin_users 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON public.contacts 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get consent statistics
CREATE OR REPLACE FUNCTION public.get_consent_statistics()
RETURNS TABLE (
    total_consents BIGINT,
    consents_today BIGINT,
    consents_this_week BIGINT,
    consents_this_month BIGINT,
    signature_types JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM public.client_consents WHERE deleted_at IS NULL) as total_consents,
        (SELECT COUNT(*) FROM public.client_consents 
         WHERE DATE(created_at) = CURRENT_DATE AND deleted_at IS NULL) as consents_today,
        (SELECT COUNT(*) FROM public.client_consents 
         WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) AND deleted_at IS NULL) as consents_this_week,
        (SELECT COUNT(*) FROM public.client_consents 
         WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND deleted_at IS NULL) as consents_this_month,
        (SELECT jsonb_build_object(
            'draw', COUNT(*) FILTER (WHERE signature_type = 'draw'),
            'upload', COUNT(*) FILTER (WHERE signature_type = 'upload')
         ) FROM public.client_consents WHERE deleted_at IS NULL) as signature_types;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete consent
CREATE OR REPLACE FUNCTION public.soft_delete_consent(consent_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.client_consents 
    SET deleted_at = NOW(), status = 'revoked'
    WHERE id = consent_uuid AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. INSERT DEFAULT ADMIN USER
-- ============================================
-- Default admin user (password: 'admin123' - CHANGE THIS!)
-- You should change this password immediately after setup

INSERT INTO public.admin_users (username, email, password_hash, full_name, role) 
VALUES (
    'admin',
    'admin@ramika-tax.com',
    '$2b$12$LQv3c1yqBTJFpdtX3loB.uJy0ER8GFN4Sg1YlYGGGvZz7lHYLN0ty', -- bcrypt hash of 'admin123'
    'System Administrator',
    'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 7. SAMPLE DATA FOR TESTING
-- ============================================

-- Insert sample consent forms for testing
INSERT INTO public.client_consents (
    client_name, 
    client_email, 
    client_phone, 
    consent_date, 
    signature_type, 
    signature_data,
    ip_address,
    user_agent,
    consent_type
) VALUES 
(
    'John Doe',
    'john.doe@example.com',
    '(555) 123-4567',
    CURRENT_DATE,
    'draw',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    '192.168.1.1'::inet,
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'tax_service_agreement'
),
(
    'Jane Smith',
    'jane.smith@example.com',
    '(555) 987-6543',
    CURRENT_DATE - INTERVAL '1 day',
    'upload',
    NULL,
    '192.168.1.2'::inet,
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'tax_service_agreement'
),
(
    'Bob Johnson',
    'bob.johnson@example.com',
    '(555) 456-7890',
    CURRENT_DATE - INTERVAL '2 days',
    'draw',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    '192.168.1.3'::inet,
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    'tax_service_agreement'
);

-- Insert sample analytics data
INSERT INTO public.consent_analytics (event_type, ip_address, user_agent, page_url, metadata) 
SELECT 
    'form_view',
    ('192.168.1.' || (RANDOM() * 254 + 1)::int)::inet,
    CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        WHEN 1 THEN 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        ELSE 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
    END,
    '/consent',
    jsonb_build_object('referrer', 'https://google.com', 'session_duration', (RANDOM() * 300 + 60)::int)
FROM generate_series(1, 50);

-- ============================================
-- 8. VIEWS FOR ADMIN DASHBOARD
-- ============================================

-- View for admin dashboard summary
CREATE OR REPLACE VIEW public.admin_consent_summary AS
SELECT 
    DATE(created_at) as consent_date,
    COUNT(*) as daily_count,
    COUNT(*) FILTER (WHERE signature_type = 'draw') as draw_signatures,
    COUNT(*) FILTER (WHERE signature_type = 'upload') as upload_signatures,
    COUNT(DISTINCT client_email) as unique_clients
FROM public.client_consents 
WHERE deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY consent_date DESC;

-- View for recent consents with enhanced information
CREATE OR REPLACE VIEW public.recent_consents AS
SELECT 
    id,
    client_name,
    client_email,
    client_phone,
    consent_date,
    signature_type,
    CASE 
        WHEN signature_data IS NOT NULL THEN 'Yes'
        WHEN signature_photo_url IS NOT NULL THEN 'Yes'
        ELSE 'No'
    END as has_signature,
    status,
    created_at,
    updated_at
FROM public.client_consents 
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 100;

-- ============================================
-- 9. GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON public.client_consents TO authenticated;
GRANT SELECT, INSERT ON public.consent_analytics TO authenticated;
GRANT SELECT, INSERT ON public.contacts TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.admin_consent_summary TO authenticated;
GRANT SELECT ON public.recent_consents TO authenticated;

-- Grant permissions to anonymous users for form submission
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.client_consents TO anon;
GRANT INSERT ON public.consent_analytics TO anon;
GRANT INSERT ON public.contacts TO anon;

-- ============================================
-- 10. SETUP COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'SUPABASE CONSENT MODULE SETUP COMPLETED!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Tables created: client_consents, admin_users, consent_analytics, contacts';
    RAISE NOTICE '✅ Storage bucket created: signatures';
    RAISE NOTICE '✅ Security policies configured';
    RAISE NOTICE '✅ Functions and triggers created';
    RAISE NOTICE '✅ Sample data inserted for testing';
    RAISE NOTICE '✅ Admin views created for dashboard';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Default Admin Credentials:';
    RAISE NOTICE '   Username: admin';
    RAISE NOTICE '   Email: admin@ramika-tax.com';
    RAISE NOTICE '   Password: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Change the default admin password immediately!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Test your setup:';
    RAISE NOTICE '   1. Go to /consent page to test form submission';
    RAISE NOTICE '   2. Go to /admin page to test admin dashboard';
    RAISE NOTICE '   3. Check Storage > signatures bucket for uploaded files';
    RAISE NOTICE '';
    RAISE NOTICE 'Setup completed successfully! 🎉';
    RAISE NOTICE '=================================================';
END $$;