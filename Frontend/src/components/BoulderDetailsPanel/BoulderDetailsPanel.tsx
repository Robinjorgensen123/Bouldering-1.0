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
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
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
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    if (!boulder?._id) return;
    setLoadingHistory(true);
    try {
      const response = await api.get(`/history/boulder/${boulder._id}`);
      setHistory(response.data.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen && boulder) {
      fetchHistory();
    }
  }, [isOpen, boulder?._id]);

  const handleLogSubmit = async () => {
    try {
      await api.post("/history", {
        boulder: boulder?._id,
        style,
        attempts,
        comment,
        completedAt: new Date().toISOString(),
      });
      alert("Climb logged successfully!");
      setComment("");
      fetchHistory();
    } catch (err) {
      console.error("Error logging climb:", err);
      alert("Failed to log climb. Please try again.");
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      {/* Box med fast bredd så testerna (och användare) ser innehållet ordentligt */}
      <Box sx={{ p: 3, width: { xs: "100vw", sm: 350 }, height: "100%" }}>
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
              <Typography variant="h6">Log Climb</Typography>

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

            <Divider sx={{ my: 4 }} />

            {/* --- HÄR ÄR DET VIKTIGA FÖR DINA TESTER --- */}
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>

            {loadingHistory ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List>
                {history.length > 0 ? (
                  history.map((log) => (
                    <ListItem key={log._id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={`${log.user?.username || "Climber"} - ${log.style}`}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {log.comment}
                            </Typography>
                            <Typography component="span" variant="caption">
                              {new Date(log.completedAt).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No logs yet.
                  </Typography>
                )}
              </List>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default BoulderDetailsPanel;
