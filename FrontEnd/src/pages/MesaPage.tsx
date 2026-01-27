import MesaForm from "../components/mesa/MesaForm";

export default function MesaPage() {
  return (
    <>
      <h1>Gestión de Mesas</h1>
      <MesaForm open={false} mode={"create"} onClose={function (): void {
              throw new Error("Function not implemented.");
          } } onSubmit={function (): void {
              throw new Error("Function not implemented.");
          } } />
    </>
  );
}
