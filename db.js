import mysql from 'mysql2/promise';
import 'dotenv/config';

// 🔍 DIAGNOSTIC LOGGING
console.log("🛠️ STARTING DB CONNECTION CHECK...");
console.log("📍 Target Host:", process.env.MYSQLHOST || "MISSING HOST");
console.log("🔌 Target Port:", process.env.MYSQLPORT || "32465 (Default)");

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  // This uses your Render variable (32465) but falls back to 3306 if empty
  port: Number(process.env.MYSQLPORT) || 32465, 
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 15000 // 15 seconds to allow Railway to wake up
};

const db = mysql.createPool(dbConfig);

// 🧪 CONNECTION TEST (Non-Blocking)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ SUCCESS: Linked to Railway Database!");
    connection.release();
  } catch (err) {
    console.error("❌ DATABASE ERROR:", err.message);
    console.log("💡 Check: Is your MYSQLPORT in Render set to 32465?");
  }
})();

export default db;