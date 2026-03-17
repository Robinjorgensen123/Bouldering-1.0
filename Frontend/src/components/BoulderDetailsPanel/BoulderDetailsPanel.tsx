import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import api from "../../services/api";
import { IBoulder } from "../../types/Boulder.types";

interface Props {
  boulder: IBoulder | null;
  isOpen: boolean;
  onClose: () => void;
}

const BoulderDetailsPanel = ({ boulder, isOpen, onClose }: Props) => {
  const [style, setStyle] = useState("");
  const [attempts, setAttempts] = useState(1);
  const [comment, setComment] = useState("");

  const handleLogSubmit = async () => {
    try {
      await api.post("/history", {
        boulder: boulder?._id,
        style,
        attempts,
        comment,
      });
      alert("Climb logged successfully!");
      onClose();
    } catch (err) {
      console.error("Error logging climb:", err);
      alert("Failed to log climb. Please try again.");
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ p: 3, height: "auto", maxHeight: "80vh" }}>
        {boulder && (
          <>
            <Typography variant="h5" fontWeight="bold">
              {boulder.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {boulder.grade} - {boulder.location}
            </Typography>

            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography variant="h6">Logg Climb</Typography>

              <FormControl fullWidth>
                <InputLabel>Style</InputLabel>
                <Select
                  value={style}
                  label="Style"
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <MenuItem value="flash">Flash</MenuItem>
                  <MenuItem value="onsight">Onsight</MenuItem>
                  <MenuItem value="redpoint">Redpoint</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Attempts"
                type="number"
                value={attempts}
                onChange={(e) => setAttempts(Number(e.target.value))}
              />

              <TextField
                label="Comment"
                multiline
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Button
                variant="contained"
                color="success"
                onClick={handleLogSubmit}
              >
                Save
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default BoulderDetailsPanel;
