import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

const app = express();
app.use(express.json());

// ✅ Allow frontend to talk to backend
app.use(cors());

let db;
initDB().then((database) => {
  db = database;
});

// Get tasks
app.get("/tasks", async (req, res) => {
  const tasks = await db.all("SELECT * FROM tasks");
  res.json(tasks);
});

// Add task
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const result = await db.run(
    "INSERT INTO tasks (title, status) VALUES (?, ?)",
    [title, "todo"]
  );
  res.json({ id: result.lastID, title, status: "todo" });
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  const { status } = req.body;
  await db.run("UPDATE tasks SET status = ? WHERE id = ?", [
    status,
    req.params.id,
  ]);
  res.json({ success: true });
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await db.run("DELETE FROM tasks WHERE id = ?", req.params.id);
  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
