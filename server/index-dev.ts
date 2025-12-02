import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createApp } from "./app";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function startDevServer() {
  const app = createApp();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve(__dirname, "../client"),
    configFile: path.resolve(__dirname, "../vite.config.ts"),
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const templatePath = path.resolve(__dirname, "../client/index.html");
      let template = await fs.readFile(templatePath, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });

  app.listen(port, () => {
    console.log(`PIXELLAB dev server running on port ${port}`);
  });
}

startDevServer();
