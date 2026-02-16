-- ============================================
-- SUPABASE CONSENT MODULE - TEST QUERIES
-- ============================================
-- Run these queries to test your setup

-- ============================================
-- 1. VERIFY TABLE CREATION
-- ============================================

-- Check if all tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('client_consents', 'admin_users', 'consent_analytics')
ORDER BY table_name;

-- ============================================
-- 2. TEST CONSENT FORM FUNCTIONALITY
-- ============================================

-- View all consent forms
SELECT 
    id,
    client_name,
    client_email,
    signature_type,
    consent_date,
    status,
    created_at
FROM public.client_consents 
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- Get consent statistics
SELECT * FROM public.get_consent_statistics();

-- View admin dashboard summary
SELECT * FROM public.admin_consent_summary;

-- ============================================
-- 3. TEST STORAGE BUCKET
-- ============================================

-- Check if signatures bucket exists
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'signatures';

-- ============================================
-- 4. TEST SECURITY POLICIES
-- ============================================

-- View all RLS policies for consent tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('client_consents', 'admin_users', 'consent_analytics');

-- ============================================
-- 5. PERFORMANCE TESTS
-- ============================================

-- Check index usage (run after some real data)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_fetch,
    idx_tup_read
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
    AND tablename IN ('client_consents', 'admin_users', 'consent_analytics');

-- ============================================
-- 6. DATA INTEGRITY TESTS
-- ============================================

-- Test consent form constraints
-- This should work (valid data)
INSERT INTO public.client_consents (
    client_name, 
    client_email, 
    signature_type,
    consent_type
) VALUES (
    'Test User',
    'test@example.com',
    'draw',
    'tax_service_agreement'
);

-- Check the inserted record
SELECT * FROM public.client_consents 
WHERE client_email = 'test@example.com' 
ORDER BY created_at DESC LIMIT 1;

-- Test signature type constraint (this should fail)
-- INSERT INTO public.client_consents (
--     client_name, 
--     client_email, 
--     signature_type
-- ) VALUES (
--     'Invalid User',
--     'invalid@example.com',
--     'invalid_type'  -- This should fail due to CHECK constraint
-- );

-- ============================================
-- 7. ANALYTICS TESTS
-- ============================================

-- Insert test analytics event
INSERT INTO public.consent_analytics (
    event_type,
    ip_address,
    user_agent,
    page_url,
    metadata
) VALUES (
    'form_view',
    '127.0.0.1'::inet,
    'Test User Agent',
    '/consent',
    '{"test": true, "timestamp": "2024-01-01T00:00:00Z"}'::jsonb
);

-- View analytics summary
SELECT 
    event_type,
    COUNT(*) as count,
    DATE_TRUNC('day', created_at) as day
FROM public.consent_analytics
GROUP BY event_type, DATE_TRUNC('day', created_at)
ORDER BY day DESC, event_type;

-- ============================================
-- 8. ADMIN USER TESTS
-- ============================================

-- Check default admin user
SELECT 
    id,
    username,
    email,
    full_name,
    role,
    is_active,
    created_at
FROM public.admin_users
WHERE username = 'admin';

-- ============================================
-- 9. FUNCTION TESTS
-- ============================================

-- Test soft delete function
SELECT public.soft_delete_consent(
    (SELECT id FROM public.client_consents WHERE client_email = 'test@example.com' LIMIT 1)
);

-- Verify soft delete worked
SELECT 
    id,
    client_email,
    status,
    deleted_at
FROM public.client_consents 
WHERE client_email = 'test@example.com';

-- ============================================
-- 10. CLEANUP TEST DATA
-- ============================================

-- Remove test records (optional)
DELETE FROM public.consent_analytics 
WHERE ip_address = '127.0.0.1'::inet;

-- Permanently delete test consent (optional)
DELETE FROM public.client_consents 
WHERE client_email = 'test@example.com';

-- ============================================
-- 11. FINAL VERIFICATION
-- ============================================

-- Get final counts
SELECT 
    'client_consents' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as active_records
FROM public.client_consents
UNION ALL
SELECT 
    'admin_users' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE is_active = TRUE) as active_records
FROM public.admin_users
UNION ALL
SELECT 
    'consent_analytics' as table_name,
    COUNT(*) as total_records,
    COUNT(*) as active_records
FROM public.consent_analytics;

-- Check storage bucket objects (if any)
SELECT 
    COUNT(*) as uploaded_signatures
FROM storage.objects 
WHERE bucket_id = 'signatures';

RAISE NOTICE 'All tests completed! Check the results above to verify everything is working correctly.';