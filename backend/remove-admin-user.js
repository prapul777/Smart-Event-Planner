const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Manasa.07',
  database: 'smart_event_planner',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function deleteAdmin() {
  const connection = await pool.getConnection();

  try {
    const email = 'admin@example.com';

    // Delete admin user
    const [result] = await connection.execute(
      'DELETE FROM users WHERE email = ? AND role = ?',
      [email, 'ADMIN']
    );

    if (result.affectedRows > 0) {
      console.log('✅ Admin user deleted successfully!');
      console.log('❌ Email: admin@example.com will now show "Login failed"');
    } else {
      console.log('ℹ️ No admin user found to delete.');
    }

  } catch (error) {
    console.error('Error deleting admin user:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

deleteAdmin();
