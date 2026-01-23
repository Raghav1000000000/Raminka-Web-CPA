// Hash Generator for Admin Password
// Usage: node generate-hash.js "your_password_here"

const bcrypt = require('bcrypt');

if (process.argv.length < 3) {
  console.log('Usage: node generate-hash.js "your_password_here"');
  process.exit(1);
}

const password = process.argv[2];
const hash = bcrypt.hashSync(password, 10);

console.log('Password Hash:');
console.log(hash);
console.log('\nAdd this to your .env.local file:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);