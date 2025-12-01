import express from "express";
import session from "express-session";
import { buildApiRouter } from "./routes";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? "pixellab-dev",
      resave: false,
      saveUninitialized: true,
    }),
  );

  app.use("/api", buildApiRouter());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  return app;
}
