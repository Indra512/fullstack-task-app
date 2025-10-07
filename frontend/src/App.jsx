import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async () => {
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTasks();
  };

  // Update status
  const updateTask = async (id, status) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>✅ Task Manager</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} ({task.status})
            <button onClick={() => updateTask(task.id, "in-progress")}>⏳</button>
            <button onClick={() => updateTask(task.id, "done")}>✔️</button>
            <button onClick={() => deleteTask(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
