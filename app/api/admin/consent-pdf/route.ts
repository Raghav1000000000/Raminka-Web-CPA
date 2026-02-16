import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/src/lib/supabase-admin'
import { checkAdminAuth } from '@/src/lib/auth'

// API route to generate PDF from consent form data
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const consentId = searchParams.get('id')

    if (!consentId) {
      return new NextResponse('Consent ID is required', { status: 400 })
    }

    // Fetch consent data from database
    const { data: consent, error } = await supabaseAdmin
      .from('client_consents')
      .select('*')
      .eq('id', consentId)
      .single()

    if (error || !consent) {
      return new NextResponse('Consent form not found', { status: 404 })
    }

    // Generate PDF-ready HTML content
    const htmlContent = generateConsentPDF(consent)

    // Return HTML content that can be converted to PDF on the client side
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="consent-${consent.client_name.replace(/\s+/g, '_')}-${consent.id}.pdf"`
      }
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

function generateConsentPDF(consent: any) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Service Consent Form - ${consent.client_name}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        
        .letterhead {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .company-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .document-title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 30px 0;
            color: #1f2937;
        }
        
        .form-section {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 5px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-item {
            margin-bottom: 10px;
        }
        
        .label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
        }
        
        .value {
            color: #1f2937;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 2px;
        }
        
        .agreement-text {
            background: white;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
        }
        
        .agreement-text ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        
        .agreement-text li {
            margin-bottom: 8px;
        }
        
        .signature-section {
            margin-top: 30px;
            page-break-inside: avoid;
        }
        
        .signature-container {
            border: 2px solid #d1d5db;
            border-radius: 8px;
            padding: 20px;
            background: white;
            text-align: center;
            min-height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .signature-image {
            max-width: 400px;
            max-height: 100px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        
        .verification-info {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin-top: 20px;
            font-size: 12px;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="company-name">Ramika Bahri Tax Services</div>
        <div class="company-subtitle">Professional Tax Consultation Services</div>
        <div style="font-size: 14px; color: #6b7280;">
            Email: contact@ramikabahri.com | Professional Tax Consultant
        </div>
    </div>

    <div class="document-title">
        TAX SERVICE CONSENT & AUTHORIZATION AGREEMENT
    </div>

    <div class="form-section">
        <div class="section-title">Client Information</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Full Legal Name:</div>
                <div class="value">${consent.client_name}</div>
            </div>
            <div class="info-item">
                <div class="label">Email Address:</div>
                <div class="value">${consent.client_email}</div>
            </div>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Phone Number:</div>
                <div class="value">${consent.client_phone || 'Not provided'}</div>
            </div>
            <div class="info-item">
                <div class="label">Consent Date:</div>
                <div class="value">${new Date(consent.consent_date).toLocaleDateString()}</div>
            </div>
        </div>
    </div>

    <div class="form-section">
        <div class="section-title">Consent & Authorization Terms</div>
        <div class="agreement-text">
            <p><strong>By signing this form, I, the undersigned taxpayer, hereby:</strong></p>
            <ul>
                <li>Authorize Ramika Bahri Tax Services to prepare and file my tax return(s) for the specified tax year(s)</li>
                <li>Confirm that all information provided is true, complete, and accurate to the best of my knowledge</li>
                <li>Understand that I am ultimately responsible for the accuracy of my tax return</li>
                <li>Agree to pay the agreed-upon fees for tax preparation services</li>
                <li>Grant permission to communicate with the Canada Revenue Agency (CRA) on my behalf regarding this tax return</li>
                <li>Acknowledge that all documents and information will be kept confidential and secure</li>
                <li>Understand that this consent may be revoked in writing at any time</li>
            </ul>
            <p><strong>This digital signature has the same legal effect as a handwritten signature and is legally binding.</strong></p>
        </div>
    </div>

    <div class="form-section">
        <div class="section-title">Digital Signature</div>
        <div class="signature-section">
            <div class="label" style="text-align: center; margin-bottom: 15px;">Client Signature:</div>
            <div class="signature-container">
                ${consent.signature_data ? 
                    `<img src="${consent.signature_data}" alt="Client Signature" class="signature-image" />` : 
                    '<div style="color: #9ca3af;">No signature available</div>'
                }
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <div class="label">Signed by: ${consent.client_name}</div>
                <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">
                    Date: ${new Date(consent.consent_date).toLocaleDateString()}
                </div>
            </div>
        </div>
    </div>

    <div class="verification-info">
        <div class="section-title" style="margin-bottom: 10px; font-size: 14px;">Digital Verification Information</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <strong>Submission Date:</strong><br>
                ${new Date(consent.created_at).toLocaleString()}
            </div>
            <div>
                <strong>IP Address:</strong><br>
                ${consent.ip_address}
            </div>
        </div>
        <div style="margin-top: 10px;">
            <strong>Device/Browser Information:</strong><br>
            <span style="font-size: 11px;">${consent.user_agent}</span>
        </div>
    </div>

    <div class="footer">
        <div><strong>Ramika Bahri Tax Services</strong></div>
        <div>Professional Tax Consultant | Licensed Tax Preparer</div>
        <div>This document was digitally generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
        <div style="margin-top: 10px; font-style: italic;">
            This consent form is legally binding and serves as official authorization for tax preparation services.
        </div>
    </div>

    <script>
        // Auto-print functionality for PDF generation
        window.onload = function() {
            // Small delay to ensure content is fully loaded
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>
  `
}