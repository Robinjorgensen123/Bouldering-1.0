export type GradingSystem = "font" | "v-scale";

export interface IUser {
  _id: string;
  email: string;
  gradingSystem: GradingSystem;
}

export interface AuthResponse {
  token: string;
  user: IUser;
  success: boolean;
  message?: string;
}

export interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  updateUser: (updatedUser: IUser) => void;
}
