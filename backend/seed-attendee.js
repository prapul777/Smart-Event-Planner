const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seedAttendeeUser() {
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
    const hashedPassword = await bcrypt.hash('Attendee@123', 10);
    
    // Insert attendee user
    await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Attendee User', 'attendee@example.com', hashedPassword, 'ATTENDEE']
    );
    
    console.log('✅ Attendee user created: attendee@example.com / Attendee@123');
    
    connection.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await pool.end();
}

seedAttendeeUser();
