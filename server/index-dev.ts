
import express from "express";
import { createServer as createViteServer } from "vite";
import routes from "./routes";

async function startDevServer() {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const vite = await createViteServer({
    root: process.cwd(),
    server: {
      middlewareMode: "html",
      hmr:
        process.env.NODE_ENV === "production"
          ? false
          : {
              port: 5173,
              protocol: "ws",
            },
    },
  });

  // Vite middleware (serve React + HMR)
  app.use(vite.middlewares);

  // API routes
  app.use("/api", routes);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("❌ Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
      status: "error",
    });
  });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.listen(PORT, () => {
    console.log("=====================================");
    console.log(`🚀 Dev Server → http://localhost:${PORT}`);
    console.log(`🔥 Vite HMR → ws://localhost:5173`);
    console.log(`🧺 Health → http://localhost:${PORT}/api/health`);
    console.log("=====================================");
  });
}

startDevServer();
