import type { Request, Response } from "express";
import { runValidation } from "../services/validation.service.js";

export async function validateChallenge(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { challengeId } = req.params;
    const { files } = req.body;

    if (typeof challengeId !== "string") {
      res.status(400).json({
        success: false,
        message: "challengeId inválido",
      });
      return;
    }

    const result = await runValidation(challengeId, files);

    res.json(result);
  } catch {
    res.status(500).json({
      success: false,
      message: "Error al validar la solución",
    });
  }
}