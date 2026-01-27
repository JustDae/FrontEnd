import { useState } from "react";
import { createMetodoPago } from "../../services/metodoPago.service";

export default function MetodoPagoForm() {
  const [metodo, setMetodo] = useState({
    nombre: "",
    descripcion: "",
    activo: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setMetodo({ ...metodo, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createMetodoPago(metodo);
    alert("Método de pago creado");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <input name="descripcion" placeholder="Descripción" onChange={handleChange} />
      
      <label>
        <input
          type="checkbox"
          name="activo"
          checked={metodo.activo}
          onChange={handleChange}
        />
        Activo
      </label>

      <button type="submit">Guardar</button>
    </form>
  );
}
