import { supabaseAdmin } from '@/src/lib/supabase-admin'
import AdminClient from '../AdminClient'

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
              }
              
              console.log(`Generating signed URL for: ${filePath}`)
              
              const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
                .storage
                .from('tax-documents')
                .createSignedUrl(filePath, 3600) // 1 hour expiry
              
              if (signedUrlError) {
                console.error(`Error generating signed URL for ${filePath}:`, signedUrlError)
                // Fallback to original URL if signed URL generation fails
                fileUrls[pathOrUrl] = pathOrUrl
              } else if (signedUrlData?.signedUrl) {
                console.log(`✅ Generated signed URL for: ${filePath}`)
                fileUrls[pathOrUrl] = signedUrlData.signedUrl
              } else {
                console.error(`No signed URL returned for: ${filePath}`)
                fileUrls[pathOrUrl] = pathOrUrl
              }
            } catch (urlError) {
              console.error(`Exception generating signed URL for ${pathOrUrl}:`, urlError)
              fileUrls[pathOrUrl] = pathOrUrl
            }
          }
        }
      }
      console.log(`Generated ${Object.keys(fileUrls).length} signed URLs`)
    }

  } catch (error) {
    console.error('Error in AdminPage:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminClient 
        taxRequests={taxRequests}
        contacts={contacts}
        fileUrls={fileUrls}
      />
    </div>
  )
}