import { Router } from "express";
import { getChallenge } from "../controllers/challenge.controller.js";

const router = Router();

router.get("/:id", getChallenge);

export default router;
