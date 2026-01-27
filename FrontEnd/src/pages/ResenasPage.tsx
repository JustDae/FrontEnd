import ResenaForm from "../components/resena/ResenaForm";

export default function ResenasPage() {
  return (
    <>
      <h1>Reseñas</h1>
      <ResenaForm open={false} mode={"create"} onClose={function (): void {
              throw new Error("Function not implemented.");
          } } onSubmit={function (): void {
              throw new Error("Function not implemented.");
          } } />
    </>
  );
}
