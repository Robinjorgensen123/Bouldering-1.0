import React from "react";
import {
  Container,
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import { useAddBoulder } from "../../hooks/useAddBoulder";
import { LocationStep } from "./LocationStep";
import TopoCanvas from "../../../topo/components/TopoCanvas";

const AddBoulderForm: React.FC = () => {
  const { state, setters, handlers } = useAddBoulder();

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

            <Box component="form" onSubmit={handlers.handleSubmit}>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    id="name"
                    label="Name"
                    value={state.name}
                    onChange={(e) => setters.setName(e.target.value)}
                    placeholder="Boulder name"
                    required
                    fullWidth
                  />

                  <TextField
                    id="grade"
                    label="Grade"
                    value={state.grade}
                    onChange={(e) => setters.setGrade(e.target.value)}
                    placeholder="e.g 6C"
                    required
                    fullWidth
                  />
                </Stack>

                <TextField
                  id="location"
                  label="Area / Sector"
                  value={state.location}
                  onChange={(e) => setters.setLocation(e.target.value)}
                  placeholder="e.g Sector B"
                  required
                  fullWidth
                />

                <TextField
                  id="description"
                  label="Description"
                  value={state.description}
                  onChange={(e) => setters.setDescription(e.target.value)}
                  placeholder="Describe the route start, cruxes etc."
                  multiline
                  rows={4}
                  fullWidth
                />

                {state.error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {state.error}
                  </Alert>
                )}
                {state.success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {state.success}
                  </Alert>
                )}

                <LocationStep
                  lat={state.lat}
                  lng={state.lng}
                  loading={state.geoLoading}
                  onGetCoords={handlers.handleGetCoordinates}
                />

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
                      Upload a photo to draw the topo line on top of it.
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
                        onChange={handlers.handleFileChange}
                        required={!state.preview}
                      />
                    </Box>
                  </Stack>
                </Paper>

                {state.preview && (
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Draw Topo Line
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mark the route line on the image.
                      </Typography>
                      <TopoCanvas
                        imageSrc={state.preview}
                        onSavedPoints={setters.setTopoPoints}
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
                  disabled={state.geoLoading || !state.lat || !state.lng}
                >
                  {state.geoLoading
                    ? "Acquiring Location..."
                    : "Upload Boulder"}
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
