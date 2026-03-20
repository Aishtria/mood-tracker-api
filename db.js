import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 32465,
  waitForConnections: true,
  connectionLimit: 10,
  // 🚨 THIS IS THE CRITICAL FIX FOR RENDER -> RAILWAY
  ssl: {
    rejectUnauthorized: false
  }
});

// Check connection status
db.getConnection()
  .then(() => console.log("✅ SUCCESS: Linked to Railway MySQL!"))
  .catch((err) => console.error("❌ Database connection error:", err.message));

export default db;