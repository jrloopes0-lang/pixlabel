import express from "express";
import path from "path";
import routes from "./routes";

const app = express();

app.use("/api", routes);

const dist = path.join(process.cwd(), "dist");
app.use(express.static(dist));

app.get("*", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Production server rodando em http://localhost:${PORT}`);
});
