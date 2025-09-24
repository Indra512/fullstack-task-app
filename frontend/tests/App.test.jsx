import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ id: 1, title: "Mock Task", status: "todo" }]),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders Task Manager title", () => {
  render(<App />);
  expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
});

// test("loads tasks on startup", async () => {
//   render(<App />);
//   expect(await screen.findByText("Mock Task")).toBeInTheDocument();
// });

// test("adds a new task", async () => {
//   global.fetch
//     .mockImplementationOnce(() =>
//       Promise.resolve({ json: () => Promise.resolve([]) })
//     )
//     .mockImplementationOnce(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ id: 2, title: "New Task", status: "todo" }),
//       })
//     )
//     .mockImplementationOnce(() =>
//       Promise.resolve({
//         json: () => Promise.resolve([
//           { id: 1, title: "Mock Task", status: "todo" },
//           { id: 2, title: "New Task", status: "todo" },
//         ]),
//       })
//     );

//   render(<App />);
//   fireEvent.change(screen.getByPlaceholderText(/New task/i), {
//     target: { value: "New Task" },
//   });
//   fireEvent.click(screen.getByText("Add"));

//   expect(await screen.findByText("New Task")).toBeInTheDocument();
// });

test("updates task status", async () => {
  global.fetch
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([{ id: 1, title: "Mock Task", status: "todo" }]) })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({ success: true }) })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([{ id: 1, title: "Mock Task", status: "done" }]) })
    );

  render(<App />);
  fireEvent.click(await screen.findByText("✔️"));

  expect(await screen.findByText(/done/)).toBeInTheDocument();
});

test("deletes task", async () => {
  global.fetch
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([{ id: 1, title: "Mock Task", status: "todo" }]) })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({ success: true }) })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );

  render(<App />);
  fireEvent.click(await screen.findByText("🗑️"));

  expect(screen.queryByText("Mock Task")).not.toBeInTheDocument();
});
