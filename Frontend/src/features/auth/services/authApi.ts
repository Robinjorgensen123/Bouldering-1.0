import api from "../../../services/api";
import type { AuthResponse, GradingSystem, IUser } from "../types/auth.types";

export const loginUser = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (email: string, password: string) => {
  return api.post("/auth/register", { email, password });
};

export const forgotPassword = async (email: string) => {
  const response = await api.post<{
    success: boolean;
    message: string;
  }>("/auth/forgot-password", { email });

  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post<{ success: boolean; message: string }>(
    `/auth/reset-password/${token}`,
    { password },
  );

  return response.data;
};

export const updateGradingSystem = async (gradingSystem: GradingSystem) => {
  const response = await api.put<{ success: boolean; data: IUser }>(
    "/user/settings",
    {
      gradingSystem,
    },
  );

  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await api.put<{ success: boolean; message: string }>(
    "/user/change-password",
    {
      currentPassword,
      newPassword,
    },
  );

  return response.data;
};
