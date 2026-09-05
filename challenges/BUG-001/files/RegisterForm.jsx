import { useState } from "react";
import { isAgeValid } from "../utils/validation";

export default function RegisterForm() {
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAgeValid(Number(age))) {
      setError("La edad ingresada no es válida.");
      return;
    }

    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Edad
        <input
          type="number"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />
      </label>

      <button type="submit">
        Registrarse
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}