// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "../src/pages/RegisterPage.jsx";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function renderPage(onValidation = vi.fn()) {
  render(React.createElement(RegisterPage, { onValidation }));
  return onValidation;
}

describe("ciclo de vida de RegisterForm", () => {
  it("No monta el formulario mientras está cerrado", () => {
    renderPage();
    expect(screen.queryByTestId("register-form")).toBeNull();
  });

  it("No ejecuta validación mientras está cerrado", () => {
    const onValidation = renderPage();
    expect(onValidation).not.toHaveBeenCalled();
  });

  it("Monta el formulario al abrirlo", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Abrir formulario" }));
    expect(screen.queryByTestId("register-form")).not.toBeNull();
  });

  it("No muestra errores en el primer montaje", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Abrir formulario" }));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("Muestra errores después de enviar", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Abrir formulario" }));
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(screen.getAllByRole("alert")).toHaveLength(2);
  });

  it("Desmonta el formulario al cerrarlo", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Abrir formulario" }));
    await user.click(screen.getByRole("button", { name: "Cerrar formulario" }));
    expect(screen.queryByTestId("register-form")).toBeNull();
  });

  it("Detiene la validación después de desmontarlo", async () => {
    vi.useFakeTimers();
    const onValidation = renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Abrir formulario" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar formulario" }));
    const callsAfterClose = onValidation.mock.calls.length;

    await vi.advanceTimersByTimeAsync(500);
    expect(onValidation).toHaveBeenCalledTimes(callsAfterClose);
  });
});
