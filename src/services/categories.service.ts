import { api } from "./api";

export type SuccessResponseDto<T = any> = {
  success: true;
  message: string;
  data: T;
};

export type CategoryDto = {
  id: string;
  name: string;
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

export async function getCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}): Promise<PaginationDto<CategoryDto>> {
  const { data } = await api.get<SuccessResponseDto<PaginationDto<CategoryDto>>>("/categories", {
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

export async function createCategory(payload: { name: string }): Promise<CategoryDto> {
  const { data } = await api.post<SuccessResponseDto<CategoryDto>>("/categories", payload);
  return data.data;
}

export async function updateCategory(id: string, payload: { name: string }): Promise<CategoryDto> {
  const { data } = await api.put<SuccessResponseDto<CategoryDto>>(`/categories/${id}`, payload);
  return data.data;
}

export async function deleteCategory(id: string): Promise<CategoryDto> {
  const { data } = await api.delete<SuccessResponseDto<CategoryDto>>(`/categories/${id}`);
  return data.data;
}