export const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.VITE_API_URL ||
  "http://localhost:4000";
