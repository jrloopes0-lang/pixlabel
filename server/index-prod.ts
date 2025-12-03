import { createApp } from "./app";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const app = createApp();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir));
app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => {
  console.log(`PIXELLAB production server running on port ${port}`);
});
