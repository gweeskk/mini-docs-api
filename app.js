const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

app.get("/docs", (req, res) => {
  const { title, date, search } = req.query;

  let sql = "SELECT * FROM docs";
  let values = [];

  if(search) {
    sql += " WHERE title LIKE ? OR description LIKE ?";
    values.push(`%${search}%`, `%${search}%`);
  }
    else if (title) {
      sql += " WHERE title LIKE ? ";
      values.push(`%${title}%`);
    }

  if (date) {
    if (values.length > 0) {
      sql += " AND createdAt = ?";
    } else {
      sql += " WHERE createdAt = ?";
    }
    values.push(date);
    }

  db.query(sql, values, (err,results) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка получения документов"});
    }

    res.json(results);

  });
});

app.get("/docs/:id", (req, res) => {
  const docId = Number(req.params.id);
  const sql = "SELECT * FROM docs WHERE id = ?"; 

  db.query(sql, [docId], (err, results) => {  
    if (err) {
      return res.status(500).json({ message: "Ошибка получения документа" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Документ не найден" });
    }
  res.json(results[0]);
  });
});

app.post("/docs", (req, res) => {
  const { title, createdAt, description } = req.body;
  

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Просьба назвать документ" });
  }

  const sql = "INSERT INTO docs (title, createdAt, description) VALUES (?, ?,?)";
  const values = [title, createdAt || "18.03.2026", description || ""];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка создания документа" });
      
    }
  const newDoc = {
    id: result.insertId,
    title, createdAt: createdAt || "18.03.2026",
    description: description || ""
    };
    res.status(201).json(newDoc);
  
});
});


app.put("/docs/:id", (req, res) => {
  const docId = Number(req.params.id);
  const { title, createdAt, description } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Просьба назвать документ" });
  }

  const checkSql ="SELECT * FROM docs WHERE id = ?";
  db.query(checkSql, [docId], (err, results) =>{
    if (err) {
      return res.status(500).json({ message: "Ошибка получения документа" });
    }
    if (results.length === 0) {
      return res.status(404).json ({ message: "Документ не найден" });
    }
    const updateSql ="UPDATE docs SET title = ?, createdAt = ?, description = ? WHERE id = ? ";
    const updatedCreatedAt = createdAt || results[0].createdAt;
    const updatedDescription = description || results[0].description;

    db.query(updateSql, [title, updatedCreatedAt, updatedDescription, docId], (err) => {
      if (err) {
        return res.status(500).json({ message: "Ошибка обновления документа" });
      }
      const updateDoc = {
        id: docId,
        title,
        createdAt: updatedCreatedAt,
        description: updatedDescription
      };
      res.json(updateDoc);
    });
  });
});

app.delete("/docs/:id", (req, res) => {
  const docId = Number(req.params.id);
  const checkSql = "SELECT * FROM docs WHERE id = ?";

  db.query(checkSql, [docId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка получения документа" });
    }
    if (results.length ===0) {
      return res.status(404).json ({ message: "Документ не найден" });
    }
    const deletedDoc = results[0];
    const deleteSql = "DELETE FROM docs WHERE id = ?";

    db.query(deleteSql, [docId], (err) => {
      if(err) {
        return res.status(500).json({ message: "Ошибка удаления документа" });
      }
      res.json ({
        message: " Документ удален",
        deletedDoc: deletedDoc
      });
    });
  });
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});