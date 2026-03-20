import api from "../../../services/api";
import { AuthResponse, GradingSystem, IUser } from "../types/auth.types";

export const loginUser = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (email: string, password: string) => {
  return api.post("auth/register", { email, password });
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
