require("dotenv").config();
const mysql = require ("mysql2");
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к БД", err);
  return;
}
  console.log("Подключено к БД");
});
module.exports = connection;
