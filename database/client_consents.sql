-- Create client_consents table for storing digital signatures and consent forms
CREATE TABLE client_consents (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  consent_date DATE NOT NULL,
  signature_data TEXT NOT NULL, -- Base64 encoded signature image
  ip_address VARCHAR(45), -- IPv4 or IPv6 address
  user_agent TEXT, -- Browser/device information for legal verification
  consent_type VARCHAR(50) DEFAULT 'tax_service_agreement',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_client_consents_email ON client_consents(client_email);

-- Create index on consent_date for reporting
CREATE INDEX idx_client_consents_date ON client_consents(consent_date);

-- Create index on created_at for chronological sorting
CREATE INDEX idx_client_consents_created_at ON client_consents(created_at);

-- Enable RLS (Row Level Security) if using Supabase
ALTER TABLE client_consents ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (admin) to view all consents
CREATE POLICY "Admin can view all consents" ON client_consents
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for inserting new consents (public access for form submissions)
CREATE POLICY "Allow public consent submissions" ON client_consents
  FOR INSERT WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE client_consents IS 'Stores client digital signatures and consent forms for tax services';
COMMENT ON COLUMN client_consents.signature_data IS 'Base64 encoded PNG image of client digital signature';
COMMENT ON COLUMN client_consents.ip_address IS 'Client IP address when form was submitted for legal verification';
COMMENT ON COLUMN client_consents.user_agent IS 'Client browser/device info for legal verification';