// Database Connection Test
const pool = require('./db');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', result.rows[0]);
    
    // Test if pemesanan table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pemesanan'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ pemesanan table exists');
      
      // Check table structure
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'pemesanan' 
        ORDER BY ordinal_position
      `);
      
      console.log('📋 pemesanan table structure:');
      structure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
      
      // Check if table has data
      const count = await pool.query('SELECT COUNT(*) as count FROM pemesanan');
      console.log(`📊 pemesanan table has ${count.rows[0].count} rows`);
      
    } else {
      console.log('❌ pemesanan table does not exist');
      console.log('Please run the SQL setup script to create the table');
    }
    
    // Test users table
    const userTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (userTableCheck.rows[0].exists) {
      console.log('✅ users table exists');
      
      const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
      console.log(`📊 users table has ${userCount.rows[0].count} rows`);
      
    } else {
      console.log('❌ users table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await pool.end();
  }
}

// Run the test
testDatabaseConnection();
