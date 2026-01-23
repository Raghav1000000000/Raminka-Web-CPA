// Quick test to verify Supabase connection
import { supabase } from '@/src/lib/supabase';

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return Response.json({ 
        connected: false, 
        error: error.message,
        details: error.details || 'No additional details'
      });
    }

    return Response.json({ 
      connected: true, 
      message: 'Supabase connected successfully',
      recordCount: data?.length || 0
    });
  } catch (error) {
    console.error('Connection test failed:', error);
    return Response.json({ 
      connected: false, 
      error: 'Failed to connect to Supabase',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}