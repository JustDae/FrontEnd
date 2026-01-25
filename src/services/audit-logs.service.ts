import { api } from "./api";

export type AuditLog = {
  _id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  description?: string;
  createdAt: string;
};

export async function getAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
}) {
  const { data } = await api.get("/audit-logs", { 
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      action: params?.action || undefined,
      userId: params?.userId || undefined,
    }
  });
  return data;
}