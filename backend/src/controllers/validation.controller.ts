import type { Request, Response } from "express";
import {
  ChallengeValidationError,
  validateChallenge as validateChallengeService,
} from "../services/challenge.service.js";

export async function validateChallenge(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { challengeId } = req.params;
    const files: unknown = req.body?.files;

    if (typeof challengeId !== "string") {
      res.status(400).json({
        success: false,
        message: "challengeId inválido",
      });
      return;
    }

    if (!Array.isArray(files)) {
      res.status(400).json({
        success: false,
        message: "files debe ser un arreglo",
      });
      return;
    }

    const result = await validateChallengeService(challengeId, files);

    res.json(result);
  } catch (error) {
    const statusCode =
      error instanceof ChallengeValidationError ? error.statusCode : 500;

    res.status(statusCode).json({
      success: false,
      message:
        error instanceof ChallengeValidationError
          ? error.message
          : "Error al validar la solución",
    });
  }
}
