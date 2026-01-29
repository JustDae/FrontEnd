import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  rol?: {
    id: number;
    nombre: string;
  };
  profile?: string;
  isActive?: boolean;
}

export interface Rol {
  id: number;
  nombre: string;
}

export const getUsers = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get('/users', { params });
  return data;
};

export const createUser = async (formData: FormData) => {
  const { data } = await api.post('/auth/register', formData);
  return data;
};

export const updateUser = async (id: string, data: any) => {
  const { data: res } = await api.put(`/users/${id}`, data);
  return res;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const getRoles = async () => {
  const { data } = await api.get('/rol');

  if (data?.data?.items && Array.isArray(data.data.items)) {
    return data.data.items;
  }

  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;

  return [];
};

export const getUserImageUrl = (imageName?: string) => {
  if (!imageName) return undefined;
  if (imageName.startsWith('http')) return imageName;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}/public/profile/${imageName}`;
};

export const uploadUserProfile = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("profile", file);

  const { data } = await api.put(`/users/${id}/public/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};