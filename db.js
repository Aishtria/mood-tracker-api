import mysql from 'mysql2/promise';
import 'dotenv/config';

// 🔍 LAB 7 LOGGING: Initializing Database Connection Pool
console.log("🛠️ Attempting to initialize DB Pool with Host:", process.env.MYSQLHOST);

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT) || 32465,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 🧪 LAB 7 DIAGNOSTIC: Immediate Connection Test
db.getConnection()
  .then((connection) => {
    console.log("✅ SUCCESS: Database Handshake Complete!");
    console.log("🔗 Connected to Railway on Port:", process.env.MYSQLPORT);
    connection.release();
  })
  .catch((err) => {
    console.error("❌ DATABASE CONNECTION FAILED!");
    console.error("Error Code:", err.code);
    console.error("Message:", err.message);
  });

export default db;