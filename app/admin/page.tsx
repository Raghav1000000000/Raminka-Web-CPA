import { supabaseAdmin } from '@/src/lib/supabase-admin'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  let taxRequests: any[] = []
  let contacts: any[] = []
  let fileUrls: Record<string, string> = {}
  
  try {
    console.log('Fetching data on server...')
    
    // Fetch tax requests
    const { data: taxData, error: taxError } = await supabaseAdmin
      .from('tax_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (taxError) {
      console.error('Tax requests error:', taxError)
    } else {
      taxRequests = taxData ?? []
      console.log('Tax requests fetched:', taxRequests.length)
    }

    // Fetch contacts
    const { data: contactsData, error: contactsError } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (contactsError) {
      console.error('Contacts error:', contactsError)
    } else {
      contacts = contactsData ?? []
      console.log('Contacts fetched:', contacts.length)
    }

    // Generate signed URLs with improved error handling
    if (taxRequests && taxRequests.length > 0) {
      console.log('Generating signed URLs for documents...')
      for (const req of taxRequests) {
        if (req.uploaded_file_urls?.length) {
          console.log(`Processing ${req.uploaded_file_urls.length} files for request ${req.id}`)
          for (const pathOrUrl of req.uploaded_file_urls) {
            try {
              // Extract file path from full URL if it's a URL
              let filePath = pathOrUrl;
              if (pathOrUrl.startsWith('http')) {
                const urlParts = pathOrUrl.split('/');
                filePath = urlParts[urlParts.length - 1]; // Get just the filename
                console.log(`Extracted filename: ${filePath} from URL: ${pathOrUrl}`);
              }
              
              console.log(`Creating signed URL for: ${filePath}`)

              // Create signed URL with 24-hour expiry
              const { data, error } = await supabaseAdmin.storage
                .from('tax-documents')
                .createSignedUrl(filePath, 24 * 60 * 60)

              if (error) {
                console.error(`Error creating signed URL for ${filePath}:`, error)
                // Store the original path/URL as key for fallback
                fileUrls[pathOrUrl] = `/api/documents/${encodeURIComponent(filePath)}`
                console.log(`Created fallback API URL for ${filePath}`)
              } else if (data?.signedUrl) {
                fileUrls[pathOrUrl] = data.signedUrl
                console.log(`Created signed URL for ${filePath}`)
              }
            } catch (error) {
              console.error(`Exception creating signed URL for ${pathOrUrl}:`, error)
              // Extract filename for fallback
              const filename = pathOrUrl.includes('/') ? pathOrUrl.split('/').pop() : pathOrUrl;
              fileUrls[pathOrUrl] = `/api/documents/${encodeURIComponent(filename || 'unknown')}`
            }
          }
        }
      }
      console.log(`Generated ${Object.keys(fileUrls).length} file URLs (signed + fallback)`)
    }
    
  } catch (error) {
    console.error('Server-side data fetch error:', error)
  }

  return (
    <AdminClient
      taxRequests={taxRequests}
      contacts={contacts}
      fileUrls={fileUrls}
      adminPassword={process.env.NEXT_PUBLIC_ADMIN_PASSWORD!}
    />
  )
}
