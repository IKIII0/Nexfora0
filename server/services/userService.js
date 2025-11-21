const pool = require("../db");

async function createUser(nama_lengkap, email, password, role = "user") {
  const result = await pool.query(
    "INSERT INTO users (nama_lengkap, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [nama_lengkap, email, password, role]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function findAllUser() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}

module.exports = { createUser, findUserByEmail, findUserById, findAllUser };
