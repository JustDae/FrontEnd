import { api } from "./api";

export type SuccessResponseDto<T> = {
  success: true;
  message: string;
  data: T;
};

export type AuthTokenData = {
  access_token: string;
};

export async function loginApi(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<string> {
  const { data } = await api.post<SuccessResponseDto<AuthTokenData>>("/auth/login", payload);
  return data.data.access_token;
}

export async function registerApi(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<string> {
  const { data } = await api.post<SuccessResponseDto<AuthTokenData>>("/auth/register", payload);
  return data.data.access_token;
}