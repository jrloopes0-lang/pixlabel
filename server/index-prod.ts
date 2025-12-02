import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// API routes
app.use("/api", routes);

// Static files
const publicDir = path.resolve(__dirname, "../dist/public");
console.log(`📁 Serving static files from: ${publicDir}`);

app.use(express.static(publicDir, {
  maxAge: "1d",
  etag: false,
}));

// SPA fallback
app.get("*", (_req, res) => {
  const indexPath = path.join(publicDir, "index.html");
  console.log(`📄 Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("❌ Error serving index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Production server rodando em http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM recebido, fechando server...");
  server.close(() => {
    console.log("✅ Server fechado");
    process.exit(0);
  });
});
