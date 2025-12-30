const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initSchema() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Manasa.07',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true  // Allow multiple statements
  });

  try {
    const connection = await pool.getConnection();
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute entire schema (with multipleStatements enabled)
    await connection.query(schema);
    
    console.log('✅ Schema initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await pool.end();
}

initSchema();
