import mysql from 'mysql2/promise';
import 'dotenv/config';

console.log("🛠️ Attempting to connect to Railway at:", process.env.MYSQLHOST);

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: parseInt(process.env.MYSQLPORT) || 32465,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

// Immediate self-invoking test
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ SUCCESS: Linked to Railway MySQL!");
    connection.release();
  } catch (err) {
    // 🚨 FORCE LOGGING: This converts the error to a readable string
    console.error("❌ DB ERROR TYPE:", err.constructor.name);
    console.error("❌ DB ERROR MESSAGE:", err.message);
    console.error("❌ DB ERROR CODE:", err.code);
  }
})();

export default db;