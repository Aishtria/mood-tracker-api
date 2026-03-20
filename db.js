import mysql from 'mysql2/promise';
import 'dotenv/config';

// 🔍 LAB 7 LOGGING: Trace the Connection Attempt
console.log("📡 Attempting External Handshake...");
console.log("📍 Host:", process.env.MYSQLHOST);
console.log("🔌 Port:", process.env.MYSQLPORT);

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT) || 32465, 
  ssl: {
    rejectUnauthorized: false // 🔒 Required for Railway External Connections
  },
  connectTimeout: 15000 
});

// 🧪 LAB 7 DIAGNOSTIC: Test the "Bridge"
db.getConnection()
  .then((conn) => {
    console.log("✅ SUCCESS: Linked to Railway via Proxy 32465!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ CONNECTION FAILED!");
    console.error("Diagnostic Code:", err.code); // e.g., 'ETIMEDOUT'
    console.error("Full Message:", err.message);
  });

export default db;