interface ValidationResult {
  challengeId: string;
  success: boolean;
  tests: {
    name: string;
    passed: boolean;
  }[];
}

export async function runValidation(
  challengeId: string,
  files: Record<string, string>
): Promise<ValidationResult> {
  console.log(files);

  return {
    challengeId,
    success: false,
    tests: [
      {
        name: "Debe aceptar usuarios de 18 años",
        passed: false,
      },
      {
        name: "Debe aceptar usuarios mayores de 18 años",
        passed: true,
      },
      {
        name: "Debe rechazar menores de edad",
        passed: true,
      },
    ],
  };
}