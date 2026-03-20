import React, { useState } from "react";
import TopoCanvas from "./TopoCanvas";
import { useNavigate } from "react-router-dom";
import { ILinePoint } from "../../types/Boulder.types";
import { useGeolocation } from "../../hooks/useGeolocation";
import api from "../../services/api";
import axios from "axios";
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
import { useDeviceType } from "../../hooks/useDeviceType";

const AddBoulder: React.FC = () => {
  const { isMobile } = useDeviceType();
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

  const { getLocation, loading: geoLoading } = useGeolocation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGetCoordinates = async () => {
    try {
      const coords = await getLocation();
      setLat(coords.lat);
      setLng(coords.lng);
    } catch (err) {
      alert("could not retrieve location:" + err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lat == null || lng === null) {
      alert("Pleace acquire coordinates before uploading!");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("location", location);
    formData.append("grade", grade);
    formData.append("description", description);

    formData.append("coordinates", JSON.stringify({ lat, lng }));

    if (file) formData.append("image", file);

    formData.append(
      "topoData",
      JSON.stringify({ linePoints: topoPoints, holds: [] }),
    );

    try {
      const response = await api.post("/boulders", formData);
      if (response.status === 200 || response.status === 201) {
        navigate("/");
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Upload failed"
        : "Upload failed";

      alert(message);
      console.error("Upload failed", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: isMobile ? 2 : { xs: 3, md: 5 } }}>
      <Card
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: isMobile ? 2 : { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <HikingRoundedIcon color="primary" />
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
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

                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3, bgcolor: "background.paper" }}
                >
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

                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3, bgcolor: "background.paper" }}
                >
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
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Draw Topo Line
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mark the movement line on the image to save the route
                        path.
                      </Typography>
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

export default AddBoulder;
