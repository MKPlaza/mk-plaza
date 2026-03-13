import express from "express";
import { createServer as createViteServer } from "vite";
import { YouTube } from "youtube-sr";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("data.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    visitor_count INTEGER DEFAULT 0
  );
  INSERT OR IGNORE INTO stats (id, visitor_count) VALUES (1, 0);
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/visitor-count", (req, res) => {
    try {
      const row = db.prepare("UPDATE stats SET visitor_count = visitor_count + 1 WHERE id = 1 RETURNING visitor_count").get() as { visitor_count: number };
      res.json({ count: row.visitor_count });
    } catch (error) {
      console.error("Visitor count error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Missing query" });
      }

      const results = await YouTube.search(query, { limit: 1, type: "video" });
      if (results && results.length > 0) {
        res.json({ videoId: results[0].id });
      } else {
        res.status(404).json({ error: "No results found" });
      }
    } catch (error) {
      console.error("YouTube search error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
