// Test script to check Supabase connection and contacts table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env.local file for:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testContactsTable() {
  console.log('Testing Supabase connection and contacts table...');
  
  try {
    // Test basic connection
    console.log('1. Testing basic Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Contacts table error:', testError);
      
      if (testError.message.includes('relation "contacts" does not exist')) {
        console.log('💡 Solution: The contacts table needs to be created in Supabase.');
        console.log('📄 Run the SQL commands in create-contacts-table.sql in your Supabase SQL Editor.');
        return;
      }
    } else {
      console.log('✅ Contacts table exists and is accessible');
      console.log('Data count:', testData?.length || 0);
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testContactsTable();