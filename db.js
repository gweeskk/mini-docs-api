const mysql = require ("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mini_docs_db"
});
connection.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к БД", err);
  return;
}
  console.log("Подключено к БД");
});
module.exports = connection;
