import mysql from 'mysql2/promise';
import 'dotenv/config';

// 🔍 LAB 7 LOGGING: Trace the Connection Attempt
console.log("📡 Attempting External Handshake...");
console.log("📍 Host:", process.env.DB_HOST);
console.log("🔌 Port:", process.env.DB_PORT);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 32465, 
  ssl: {
    rejectUnauthorized: false // 🔒 Required for Railway External Connections
  },
  connectTimeout: 15000 
});

// 🧪 LAB 7 DIAGNOSTIC: Test the "Bridge"
db.getConnection()
  .then((conn) => {
    console.log("✅ SUCCESS: Linked to Railway via Proxy!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ CONNECTION FAILED!");
    console.error("Diagnostic Code:", err.code); 
    console.error("Full Message:", err.message);
  });

export default db;