import { compressImageFile } from "../utils/compressImageFile";
import React, { useState } from "react";
import { convertHeicToJpg } from "../utils/convertHeicToJpg";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import { useGeolocation } from "../../../hooks/useGeolocation";
import { type ILinePoint } from "../types/boulder.types";
import { createBoulder, getUploadErrorMessage } from "../services/boulderApi";
import TopoCanvas from "./TopoCanvas";

const AddBoulderForm: React.FC = () => {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { getLocation, loading: geoLoading } = useGeolocation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      let selectedFile = e.target.files[0];

      // 1. Convert HEIC to JPG if needed (iOS default format)
      try {
        selectedFile = await convertHeicToJpg(selectedFile);
      } catch (err) {
        setErrorMessage("Could not convert HEIC image: " + err);
        return;
      }

      // 2. Compress the image to reduce file size before upload
      try {
        selectedFile = await compressImageFile(selectedFile, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1600,
        });
      } catch (err) {
        setErrorMessage("Could not compress image: " + err);
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGetCoordinates = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const coords = await getLocation();
      setLat(coords.lat);
      setLng(coords.lng);
      setSuccessMessage("Coordinates retrieved!");
    } catch (err) {
      setErrorMessage("Could not retrieve location: " + err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (lat == null || lng === null) {
      setErrorMessage("Retrieve coordinates before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("grade", grade);
    formData.append("description", description);
    formData.append("coordinates", JSON.stringify({ lat, lng }));
    if (file) {
      formData.append("image", file);
    }
    formData.append(
      "topoData",
      JSON.stringify({ linePoints: topoPoints, holds: [] }),
    );

    try {
      const response = await createBoulder(formData);
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Boulder uploaded!");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (error) {
      const message = getUploadErrorMessage(error);
      setErrorMessage(message);
      console.error("Upload failed", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Card
        elevation={0}
        sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <HikingRoundedIcon color="primary" />
                <Typography variant="h4" fontWeight="bold">
                  Add New Boulder
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                Add route details, capture the wall image, and draw the topo
                line before publishing.
              </Typography>
            </Box>

            <Divider />

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    id="name"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Boulder name"
                    required
                    fullWidth
                  />

                  <TextField
                    id="grade"
                    label="Grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                    fullWidth
                  />
                </Stack>

                <TextField
                  id="location"
                  label="Area / Sector"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g Sector B"
                  required
                  fullWidth
                />

                <TextField
                  id="description"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the route"
                  multiline
                  rows={4}
                  fullWidth
                />

                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Alert>
                )}
                {successMessage && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                  </Alert>
                )}
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ExploreRoundedIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        Location
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Fetch your current coordinates and attach them to this
                      boulder.
                    </Typography>
                    <Box>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleGetCoordinates}
                        disabled={geoLoading}
                        startIcon={<NearMeRoundedIcon />}
                      >
                        {geoLoading
                          ? "Acquiring location..."
                          : "Get Coordinates"}
                      </Button>
                    </Box>
                    {lat && lng && (
                      <Alert severity="success" sx={{ alignItems: "center" }}>
                        Lat: {lat.toFixed(5)} | Lng: {lng.toFixed(5)}
                      </Alert>
                    )}
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AddPhotoAlternateRoundedIcon
                        color="primary"
                        fontSize="small"
                      />
                      <Typography variant="subtitle1" fontWeight={700}>
                        Wall Image
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Upload a photo so you can draw the topo line directly on
                      top of it.
                    </Typography>
                    <Box>
                      <label htmlFor="image">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={0.5}
                        >
                          Select Image
                        </Typography>
                      </label>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Box>
                  </Stack>
                </Paper>

                {preview && (
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Draw Topo Line
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mark the movement line on the image to save the route
                        path.
                      </Typography>
                      <img
                        src={preview}
                        alt="preview"
                        style={{
                          maxWidth: "100%",
                          borderRadius: 8,
                          marginBottom: 12,
                        }}
                      />
                      <TopoCanvas
                        imageSrc={preview}
                        onSavedPoints={(points) => setTopoPoints(points)}
                      />
                    </Stack>
                  </Paper>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<UploadRoundedIcon />}
                >
                  Upload Boulder
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddBoulderForm;
