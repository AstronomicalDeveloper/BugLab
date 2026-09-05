import type { Request, Response } from "express";
import {
  ChallengeNotFoundError,
  loadChallenge,
} from "../services/challenge.service.js";

export async function getChallenge(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Id de caso inválido",
    });
    return;
  }

  try {
    res.json(await loadChallenge(id));
  } catch (error) {
    if (error instanceof ChallengeNotFoundError) {
      res.status(404).json({
        success: false,
        message: `No se encontró el caso ${id}`,
      });
      return;
    }

    console.error(`Error al leer el caso ${id}:`, error);
    res.status(500).json({
      success: false,
      message: "Error al leer el caso",
    });
  }
}
