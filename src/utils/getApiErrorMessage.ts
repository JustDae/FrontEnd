export function getApiErrorMessage(err: any): string {
  const fallback = "Ocurrió un error inesperado.";

  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;

  if (Array.isArray(msg)) return msg.join(" | ");
  return String(msg);
}