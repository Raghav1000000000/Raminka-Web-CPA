// Debug utility to test environment variables and auth
const bcrypt = require('bcryptjs');

console.log('=== DEBUG AUTH SETUP ===');

// Test environment variable loading
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
console.log('ADMIN_PASSWORD_HASH value:', process.env.ADMIN_PASSWORD_HASH);

if (process.env.ADMIN_PASSWORD_HASH) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  console.log('Hash length:', hash.length);
  console.log('Hash starts with $2a:', hash.startsWith('$2a'));
  
  // Test with known password
  const testPassword = 'admin123';
  try {
    const isValid = bcrypt.compareSync(testPassword, hash);
    console.log(`Testing password "${testPassword}":`, isValid);
  } catch (error) {
    console.error('Bcrypt comparison error:', error);
  }
} else {
  console.error('❌ ADMIN_PASSWORD_HASH not found in environment!');
}

console.log('=== END DEBUG ===');