import React, { useEffect, useState } from "react";

const NOOP = () => {};

function validateProduct(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!values.price || Number(values.price) <= 0) {
    errors.price = "El precio debe ser mayor que cero.";
  }
  return errors;
}

export default function RegisterForm({ onValidation = NOOP }) {
  const [values, setValues] = useState({ name: "", price: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    onValidation(validateProduct(values));
    const intervalId = window.setInterval(() => {
      onValidation(validateProduct(values));
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [onValidation, values]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateProduct(values));
  };

  return (
    <form
      aria-label="Formulario de producto"
      data-testid="register-form"
      onSubmit={handleSubmit}
    >
      <label>
        Nombre
        <input
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
      </label>
      {errors.name && <p role="alert">{errors.name}</p>}

      <label>
        Precio
        <input
          value={values.price}
          onChange={(e) => setValues({ ...values, price: e.target.value })}
        />
      </label>
      {errors.price && <p role="alert">{errors.price}</p>}

      <button type="submit">Guardar</button>
    </form>
  );
}
