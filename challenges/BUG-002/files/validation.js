export function shouldShowErrors(hasSubmitted) {
  return true; 
}

export function validateProduct(values) {
  const errors = {};
  if (!values.name || values.name.trim() === "") {
    errors.name = "El nombre es obligatorio.";
  }
  if (!values.price || Number(values.price) <= 0) {
    errors.price = "El precio debe ser un número mayor que cero.";
  }
  return errors;
}