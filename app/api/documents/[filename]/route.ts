import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/src/lib/supabase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Validate filename
    if (!filename || typeof filename !== 'string') {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    console.log(`Attempting to download file: ${filename}`);

    // Try to download the file directly from Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('tax-documents')
      .download(filename);

    if (error) {
      console.error('Supabase storage error:', error);
      return new NextResponse('File not found', { status: 404 });
    }

    if (!data) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Get the file extension to determine content type
    const extension = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'doc':
        contentType = 'application/msword';
        break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Return the file with appropriate headers
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error in document download route:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}