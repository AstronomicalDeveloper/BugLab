import express from "express";
import cors from "cors";
import challengeRoutes from "./routes/challenge.routes.js";
import validationRoutes from "./routes/validation.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "BugLab API",
    status: "ok",
  });
});

app.use("/api/challenges", challengeRoutes);
app.use("/api/validation", validationRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`BugLab API: http://localhost:${PORT}`);
});