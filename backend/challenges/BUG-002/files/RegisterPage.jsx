import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm.jsx";

export default function RegisterPage({ onValidation }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>Nuevo producto</h1>
      <button type="button" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "Cerrar formulario" : "Abrir formulario"}
      </button>

      <div
        aria-hidden={!isOpen}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <RegisterForm onValidation={onValidation} />
      </div>
    </div>
  );
}
