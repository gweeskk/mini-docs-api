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
  const { title, date } = req.query;

  let sql = "SELECT * FROM docs";
  let values = [];

  if (title) {
    sql += " WHERE title = ?";
    values.push(title);
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
  const { title, createdAt } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Просьба назвать документ" });
  }

  const sql = "INSERT INTO docs (title, createdAt) VALUES (?, ?)";
  const values = [title, createdAt || "18.03.2026"];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка создания документа" });
      
    }
  const newDoc = {
    id: result.insertId,
    title, createdAt: createdAt || "18.03.2026" 
    };
    res.status(201).json(newDoc);
  
});
});


app.put("/docs/:id", (req, res) => {
  const docId = Number(req.params.id);
  const { title, createdAt } = req.body;

  if (!title) {
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
    const updateSql ="UPDATE docs SET title = ?, createdAt = ? WHERE id = ? ";
    const updatedCreatedAt = createdAt || results[0].createdAt;

    db.query(updateSql, [title, updatedCreatedAt, docId], (err) => {
      if (err) {
        return res.status(500).json({ message: "Ошибка обновления документа" });
      }
      const updateDoc = {
        id: docId,
        title,
        createdAt: updatedCreatedAt
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

app.listen(4000, () => {
  console.log("server started on port 4000");
});

