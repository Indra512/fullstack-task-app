import sqlite3 from "sqlite3";
import { open } from "sqlite"

export const initDB = async () => {
  const db = await open({
    filename: "./tasks.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      status TEXT
    )
  `);

  // ✅ Clean DB when running in TEST mode (Playwright / CI)
  if (process.env.RESET_DB === "true") {
    await db.exec("DELETE FROM tasks");
  }
  return db;
};
