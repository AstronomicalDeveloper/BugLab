import { useState } from "react";
import { filterAvailableProducts } from "./validation.js";

export default function RegisterForm() {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Mouse", available: true },
    { id: 2, name: "Teclado", available: false },
    { id: 3, name: "Monitor", available: true },
  ]);

  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const visibleProducts = showOnlyAvailable
    ? filterAvailableProducts(inventory)
    : inventory;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showOnlyAvailable}
          onChange={(e) => setShowOnlyAvailable(e.target.checked)}
        />
        Solo disponibles
      </label>
      <ul>
        {visibleProducts.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}