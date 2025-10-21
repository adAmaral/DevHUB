// ==============================
// ✅ CONFIGURAÇÃO DO BANCO DE DADOS (MySQL LOCAL - root)
// ==============================
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "summit_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then(conn => {
    console.log("✅ Conexão com MySQL estabelecida com sucesso (root@127.0.0.1:3306)!");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Erro ao conectar com o MySQL:", err.message);
  });

module.exports = pool;
