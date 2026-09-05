import { Router } from "express";
import { validateChallenge } from "../controllers/validation.controller.js";

const router = Router();

router.post("/:challengeId", validateChallenge);

export default router;