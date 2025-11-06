import pool from '../config/db.js'

async function checkAccountsTable() {
  try {
    console.log('🔍 Checking accounts table structure...')
    
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'accounts' AND TABLE_SCHEMA = 'barangay_bis'
    `)
    
    if (columns.length === 0) {
      console.error('❌ accounts table does NOT exist!')
      console.error('📝 You need to run this SQL in MySQL:')
      console.error(`
        DROP TABLE IF EXISTS accounts;
        CREATE TABLE IF NOT EXISTS accounts (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
      return false
    }
    
    console.log('✅ accounts table exists!')
    console.log('📋 Table structure:')
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} ${col.EXTRA || ''} ${col.COLUMN_KEY ? '[' + col.COLUMN_KEY + ']' : ''}`)
    })
    
    // Check if user_id has AUTO_INCREMENT
    const autoInc = columns.find(c => c.COLUMN_NAME === 'user_id' && c.EXTRA.includes('auto_increment'))
    if (!autoInc) {
      console.error('❌ user_id is NOT auto_increment!')
      console.error('This is why account creation fails. Run the SQL above to fix it.')
      return false
    }
    
    console.log('✅ user_id is AUTO_INCREMENT - Good!')
    return true
    
  } catch (err) {
    console.error('❌ Error checking table:', err.message)
    return false
  }
}

checkAccountsTable().then(success => {
  if (success) {
    console.log('\n✅ Database is ready for account creation!')
  } else {
    console.log('\n❌ Database needs to be fixed before account creation will work')
  }
  process.exit(0)
})
