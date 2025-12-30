const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seedUser() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Manasa.07',
    database: 'smart_event_planner',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();
    
    // Hash password
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    
    // Insert test user
    await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Test User', 'test@example.com', hashedPassword, 'ORGANIZER']
    );
    
    console.log('✅ Test user created: test@example.com / Test@123');
    
    connection.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await pool.end();
}

seedUser();
