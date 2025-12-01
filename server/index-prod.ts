import express from "express";
import path from "path";
import routes from "./routes";

const app = express();

app.use("/api", routes);

const publicDir = path.join(process.cwd(), "dist", "public");
app.use(express.static(publicDir));

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Production server rodando em http://localhost:${PORT}`);
});
