import { useState } from "react";
import { validateProduct, shouldShowErrors } from "./validation.js";

export default function RegisterForm() {
  const [values, setValues] = useState({ name: "", price: "" });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const errors = shouldShowErrors(hasSubmitted) ? validateProduct(values) : {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
      {errors.name && <p>{errors.name}</p>}
      <input value={values.price} onChange={(e) => setValues({ ...values, price: e.target.value })} />
      {errors.price && <p>{errors.price}</p>}
      <button type="submit">Guardar</button>
    </form>
  );
}