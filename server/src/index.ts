import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { router } from "./routes.js";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin || true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(router);

app.listen(config.port, () => {
  console.log(`Auth API running on http://localhost:${config.port}`);
});
