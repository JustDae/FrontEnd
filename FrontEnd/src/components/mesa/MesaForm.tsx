import { useState } from "react";
import { createMesa } from "../../services/mesa.service";

export default function MesaForm() {
  const [mesa, setMesa] = useState({
    numeroMesa: "",
    capacidad: 0,
    estado: "DISPONIBLE",
    ubicacion: "",
  });

  const handleChange = (e: any) => {
    setMesa({ ...mesa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createMesa(mesa);
    alert("Mesa creada");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="numeroMesa" placeholder="Número de mesa" onChange={handleChange} />
      <input name="capacidad" type="number" placeholder="Capacidad" onChange={handleChange} />
      <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} />
      <button type="submit">Guardar</button>
    </form>
  );
}
