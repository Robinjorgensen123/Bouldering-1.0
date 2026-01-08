import React, { useState } from "react";
import TopoCanvas from "./TopoCanvas";
import "./addBoulder.scss";
import { useNavigate } from "react-router-dom";
import { ILinePoint } from "../../types/Boulder.types";

const AddBoulder: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [topoPoints, setTopoPoints] = useState<ILinePoint[]>([]);
  const [location, setLocation] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lat == null || lng === null) {
      alert("Please get the coordinates first!");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", name);
    formData.append("location", location);
    formData.append("grade", grade);
    formData.append("description", description);

    formData.append("coordinates", JSON.stringify({ lat, lng }));

    if (file) formData.append("image", file);

    formData.append(
      "topoData",
      JSON.stringify({ linePoints: topoPoints, holds: [] })
    );

    try {
      const response = await fetch("http://localhost:5000/api/boulders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  return (
    <div className="add-boulder-page">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="grade">Grade</label>
          <input
            id="grade"
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="coords-section">
          <button type="button" onClick={handleGetCoordinates}>
            Get Coordinates
          </button>
          {lat && lng && (
            <div className="coords-display">
              <p>Lat: {lat}</p>
              <p>Lng: {lng}</p>
            </div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="image">Select Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="location">Area / Sector</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g Sektor B"
            required
          />
        </div>

        {preview && (
          <TopoCanvas
            imageSrc={preview}
            onSavedPoints={(points) => setTopoPoints(points)}
          />
        )}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default AddBoulder;
