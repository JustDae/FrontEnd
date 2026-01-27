import { useState } from "react";
import { createResena } from "../../services/resena.service";

export default function ResenaForm() {
  const [resena, setResena] = useState({
    comentario: "",
    calificacion: 5,
  });

  const handleChange = (e: any) => {
    setResena({ ...resena, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createResena(resena);
    alert("Reseña enviada");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="comentario"
        placeholder="Escribe tu reseña"
        onChange={handleChange}
      />

      <select name="calificacion" onChange={handleChange}>
        <option value={5}>⭐⭐⭐⭐⭐</option>
        <option value={4}>⭐⭐⭐⭐</option>
        <option value={3}>⭐⭐⭐</option>
        <option value={2}>⭐⭐</option>
        <option value={1}>⭐</option>
      </select>

      <button type="submit">Enviar</button>
    </form>
  );
}
