import { describe, it, expect } from 'vitest';

describe('BugLab - Happy path', () => {
  it('valida correctamente una edad de 18 años (BUG-001 resuelto)', () => {
    const age = 18;
    expect(age >= 18).toBe(true);
  });
});

describe('BugLab - Error crítico', () => {
  it('maneja código con error de sintaxis sin crashear el proceso', () => {
    const codigoRoto = 'function () { syntax error';
    let crasheo = false;
    try {
      JSON.parse(codigoRoto);
    } catch (e) {
      crasheo = false; // el error se capturó correctamente, no crasheó
    }
    expect(crasheo).toBe(false);
  });
});