const express = require("express");
const app = express();

app.use(express.json());

let docs = [
  { id: 1, title: "Document1", createdAt: "18.03.2026" },
  { id: 2, title: "Document2", createdAt: "18.03.2026" },
  { id: 3, title: "Document3", createdAt: "18.03.2026" }
];

app.get("/docs", (req, res) => {
  res.json(docs);
});

app.get("/docs/:id", (req, res) => {
  const docId = Number(req.params.id);
  const doc = docs.find(item => item.id === docId);

  if (!doc) {
    return res.status(404).json({ message: "Документ не найден" });
  }

  res.json(doc);
});

app.post("/docs", (req, res) => {
  const { title, createdAt} = req.body;

  if (!title) {
    return res.status(400).json({ message: "Просьба назвать документ" });
  }


  const newDoc = {
    id: docs.length + 1,
    title: req.body.title,
    createdAt: createdAt || "18.03.2026" 
};

docs.push(newDoc);

res.status(201).json(newDoc);

});

app.put("/docs/:id", (req, res) => {
  const docId = Number(req.params.id);
  const doc = docs.find(item => item.id === docId);

  if (!doc) {
    return res.status(404).json({ message: "Документ не найден" });
  }

  const {title, createdAt} = req.body;
  if (!title) {
    return res.status(400).json({ message: "Просьба назвать документ" });
  }

  doc.title = title;
  doc.createdAt = createdAt || doc.createdAt;

  res.json(doc);
});

app.delete("/docs/:id", (req, res) => {
  const docId = Number(req.params.id);
  const docIndex = docs.findIndex(item => item.id === docId);
  
  if ( docIndex === -1) {
    return res.status(404).json({ message: "Документ не найден" });
  }

const deletedDoc = docs.splice(docIndex, 1)[0];

res.json({
  message: "Документ удален",
  deletedDoc: deletedDoc
});

});

app.listen(3000, () => {
  console.log("server started on port 3000");
});

