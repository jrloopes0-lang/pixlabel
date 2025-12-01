import express from "express";
import { createServer as createViteServer } from "vite";
import routes from "./routes";

async function startDevServer() {
  const app = express();

  try {
    const vite = await createViteServer({
      root: process.cwd(),
      server: {
        middlewareMode: true,
        hmr: {
          port: 5173,
          host: "localhost",
        },
      },
    });

    app.use(vite.middlewares);
    app.use("/api", routes);

    const PORT = 3000;

    app.listen(PORT, () => {
      console.log("==========================================");
      console.log(`🚀 Dev Server ON → http://localhost:${PORT}`);
      console.log(`🔥 HMR (Vite) → ws://localhost:5173`);
      console.log(`🩺 Health → http://localhost:${PORT}/api/health`);
      console.log("==========================================");
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor dev:", error);
  }
}

startDevServer();
