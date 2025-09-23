import request from "supertest";
import express from "express";
import { initDB } from "../src/db.js";
import cors from "cors";

let app, db;

beforeAll(async () => {
  db = await initDB();
  await db.exec("DELETE FROM tasks"); // clean DB
  app = express();
  app.use(express.json());
  app.use(cors());

  // Routes
  app.get("/tasks", async (req, res) => {
    const tasks = await db.all("SELECT * FROM tasks");
    res.json(tasks);
  });

  app.post("/tasks", async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const result = await db.run(
      "INSERT INTO tasks (title, status) VALUES (?, ?)",
      [title, "todo"]
    );
    res.json({ id: result.lastID, title, status: "todo" });
  });

  app.put("/tasks/:id", async (req, res) => {
    const { status } = req.body;
    await db.run("UPDATE tasks SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    res.json({ success: true });
  });

  app.delete("/tasks/:id", async (req, res) => {
    await db.run("DELETE FROM tasks WHERE id = ?", req.params.id);
    res.json({ success: true });
  });
});

afterAll(async () => {
  await db.close();
});

test("POST /tasks should create a new task", async () => {
  const res = await request(app).post("/tasks").send({ title: "Unit Test Task" });
  expect(res.statusCode).toBe(200);
  expect(res.body.title).toBe("Unit Test Task");
  expect(res.body.status).toBe("todo");
});

test("GET /tasks should return all tasks", async () => {
  const res = await request(app).get("/tasks");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});

test("PUT /tasks/:id should update task status", async () => {
  const res1 = await request(app).post("/tasks").send({ title: "To Update" });
  const taskId = res1.body.id;

  const res2 = await request(app).put(`/tasks/${taskId}`).send({ status: "done" });
  expect(res2.statusCode).toBe(200);

  const res3 = await request(app).get("/tasks");
  const updated = res3.body.find((t) => t.id === taskId);
  expect(updated.status).toBe("done");
});

test("DELETE /tasks/:id should remove task", async () => {
  const res1 = await request(app).post("/tasks").send({ title: "To Delete" });
  const taskId = res1.body.id;

  const res2 = await request(app).delete(`/tasks/${taskId}`);
  expect(res2.statusCode).toBe(200);

  const res3 = await request(app).get("/tasks");
  const deleted = res3.body.find((t) => t.id === taskId);
  expect(deleted).toBeUndefined();
});

test("POST /tasks should fail without title", async () => {
  const res = await request(app).post("/tasks").send({});
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe("Title required");
});
