import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "../../../hooks/useGeolocation";
import { createBoulder, getUploadErrorMessage } from "../services/boulderApi";
import { type ILinePoint } from "../types/boulder.types";

export const useAddBoulder = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [topoPoints, setTopoPoints] = useState<ILinePoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { getLocation, loading: geoLoading } = useGeolocation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGetCoordinates = async () => {
    setError(null);
    try {
      const coords = await getLocation();
      setLat(coords.lat);
      setLng(coords.lng);
      setSuccess("Coordinates retrieved!");
    } catch (err) {
      setError("Could not retrieve location.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lat == null || lng === null)
      return setError("Retrieve coordinates first!");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("grade", grade);
    formData.append("description", description);
    formData.append("coordinates", JSON.stringify({ lat, lng }));
    if (file) formData.append("image", file);
    formData.append(
      "topoData",
      JSON.stringify({ linePoints: topoPoints }),
    );

    try {
      const response = await createBoulder(formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Boulder uploaded!");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      setError(getUploadErrorMessage(err));
    }
  };

  return {
    state: {
      name,
      grade,
      description,
      location,
      preview,
      lat,
      lng,
      geoLoading,
      error,
      success,
    },
    setters: { setName, setGrade, setDescription, setLocation, setTopoPoints },
    handlers: { handleFileChange, handleGetCoordinates, handleSubmit },
  };
};
