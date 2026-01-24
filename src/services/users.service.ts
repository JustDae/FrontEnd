import { api } from "./api";

export type SuccessResponseDto<T = any> = {
  success: true;
  message: string;
  data: T;
};

export type PaginateMeta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PaginateLinks = {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
};

export type PaginationDto<T> = {
  items: T[];
  meta: PaginateMeta;
  links?: PaginateLinks;
};

export type UserDto = {
  id: string;
  username: string;
  email?: string;
  role?: string;
};

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}): Promise<PaginationDto<UserDto>> {
  const { data } = await api.get<SuccessResponseDto<PaginationDto<UserDto>>>("/users", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search || undefined,
      searchField: params?.searchField || undefined,
      sort: params?.sort || undefined,
      order: params?.order || undefined,
    },
  });
  return data.data;
}

export async function createUser(payload: {
  username: string;
  email: string;
  password: string;
  role?: string;
}): Promise<UserDto> {
  const { data } = await api.post<SuccessResponseDto<UserDto>>("/users", payload);
  return data.data;
}

export async function updateUser(id: string, payload: {
  username: string;
  email: string;
  role?: string;
}): Promise<UserDto> {
  const { data } = await api.put<SuccessResponseDto<UserDto>>(`/users/${id}`, payload);
  return data.data;
}

export async function deleteUser(id: string): Promise<UserDto> {
  const { data } = await api.delete<SuccessResponseDto<UserDto>>(`/users/${id}`);
  return data.data;
}