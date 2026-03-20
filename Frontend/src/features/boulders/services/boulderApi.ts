import axios from "axios";
import api from "../../../services/api";
import { BoulderListResponse } from "../types/boulder.types";

export const fetchBoulders = async () => {
  const response = await api.get<BoulderListResponse>("/boulders");
  return response.data;
};

export const createBoulder = async (formData: FormData) => {
  return api.post("/boulders", formData);
};

export const getUploadErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Upload failed";
  }

  return "Upload failed";
};
