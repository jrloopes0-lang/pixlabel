import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, statSync } from "fs";

// Import routes
import routes from "./routes.js";

// ESM __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check (early response)
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API routes
app.use("/api", routes);

// Determine public directory
const publicDir = (() => {
  // In production, dist/public is 1 level up from bundled index.js
  const possiblePaths = [
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "../../dist/public"),
    path.resolve(process.cwd(), "dist/public"),
  ];
  
  for (const dir of possiblePaths) {
    try {
      if (existsSync(dir) && statSync(dir).isDirectory()) {
        console.log(`✅ Found public directory: ${dir}`);
        return dir;
      }
    } catch (e) {
      // Continue to next path
    }
  }
  
  // Fallback
  console.warn(`⚠️ Public directory not found, using default: ${possiblePaths[2]}`);
  return possiblePaths[2];
})();

// Static file serving
app.use(express.static(publicDir, {
  maxAge: "1h",
  etag: false,
  extensions: ["html", "js", "css", "json"],
}));

// SPA fallback route
app.get("*", (req, res) => {
  // Don't serve HTML for actual files
  if (path.extname(req.path)) {
    return res.status(404).send("Not found");
  }
  
  const indexPath = path.join(publicDir, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`❌ Error serving ${indexPath}:`, err.message);
      res.status(500).json({ error: "Failed to serve application" });
    }
  });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Unhandled error:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Server setup
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

if (!isValidPort(PORT)) {
  console.error(`❌ Invalid PORT: ${PORT}`);
  process.exit(1);
}

function isValidPort(port: number): boolean {
  return port > 0 && port < 65536 && Number.isInteger(port);
}

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  ✅ PIXLABEL Production Server Started    ║
╚════════════════════════════════════════════╝

📍 URL: http://${HOST}:${PORT}
🌍 Environment: ${process.env.NODE_ENV || "production"}
📂 Static files: ${publicDir}
🏥 Health check: /api/health
  `);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n📛 ${signal} received, gracefully shutting down...`);
  
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
  
  // Force exit after 30 seconds
  setTimeout(() => {
    console.error("❌ Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
