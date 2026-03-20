import mysql from 'mysql2/promise';
import 'dotenv/config';

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE || 'railway', 
  // We use 32465 because it is your EXTERNAL port for Render
  port: Number(process.env.MYSQLPORT) || 32465, 
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 20000 // Increased to 20s for slower connections
};

const db = mysql.createPool(dbConfig);

// Lab 7 Diagnostic Logging
console.log("🚀 Attempting connection to:", dbConfig.host);
console.log("📡 Using Port:", dbConfig.port);

db.getConnection()
  .then(conn => {
    console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
    conn.release();
  })
  .catch(err => {
    console.error("❌ CONNECTION FAILED:", err.message);
  });

export default db;