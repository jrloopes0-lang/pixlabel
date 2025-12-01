import express from "express";
import fs from "fs/promises";
import path from "path";
import { createServer as createViteServer } from "vite";
import routes from "./routes";

async function startServer() {
  const app = express();
  const host = process.env.HOST || "0.0.0.0";
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use("/api", routes);

  if (process.env.NODE_ENV === "development") {
    const hmrHost = process.env.HMR_HOST || host;
    const hmrPort = Number(process.env.HMR_PORT) || 5173;
    const clientRoot = path.resolve(process.cwd(), "client");

    const vite = await createViteServer({
      appType: "custom",
      root: clientRoot,
      server: {
        host: true,
        middlewareMode: true,
        hmr: {
          host: hmrHost,
          port: hmrPort,
        },
      },
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.join(clientRoot, "index.html");
        const template = await fs.readFile(templatePath, "utf-8");
        const html = await vite.transformIndexHtml(url, template);
        res
          .status(200)
          .set({ "Content-Type": "text/html" })
          .end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });

    app.listen(port, host, () => {
      console.log("==========================================");
      console.log(`🚀 Dev Server ON → http://${host}:${port}`);
      console.log(`🔥 HMR (Vite) → ws://${hmrHost}:${hmrPort}`);
      console.log(`🩺 Health → http://${host}:${port}/api/health`);
      console.log("==========================================");
    });

    return;
  }

  const publicDir = path.join(process.cwd(), "dist", "public");
  app.use(express.static(publicDir));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  app.listen(port, host, () => {
    console.log(`🚀 Production server rodando em http://${host}:${port}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Erro ao iniciar servidor:", error);
});
