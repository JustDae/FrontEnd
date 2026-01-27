import MetodoPagoForm from "../components/metodoPago/MetodoPagoFormDialog";

export default function MetodoPagoPage() {
  return (
    <>
      <h1>Métodos de Pago</h1>
      <MetodoPagoForm open={false} mode={"create"} onClose={function (): void {
              throw new Error("Function not implemented.");
          } } onSubmit={function (): void {
              throw new Error("Function not implemented.");
          } } />
    </>
  );
}
