const mysql = require('mysql2/promise');

async function fixSchema() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Manasa.07',
    database: 'smart_event_planner',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  });

  try {
    const connection = await pool.getConnection();
    
    // Try to add image_path column, ignore if it already exists
    try {
      await connection.query(`ALTER TABLE events ADD COLUMN image_path VARCHAR(512) DEFAULT NULL;`);
      console.log('✅ image_path column added to events table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ image_path column already exists');
      } else {
        throw err;
      }
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await pool.end();
}

fixSchema();
