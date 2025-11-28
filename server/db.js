const { Pool } = require("pg");
const path = require("path");

// Load .env from server directory
require("dotenv").config({ path: path.join(__dirname, '.env') });

console.log('Environment check:');
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('- NODE_ENV:', process.env.NODE_ENV);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  console.error("Please set DATABASE_URL in Railway dashboard or .env file");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
