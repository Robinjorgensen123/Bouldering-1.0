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
  Paper,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { IBoulder } from "../../types/Boulder.types";
import { useDeviceType } from "../../hooks/useDeviceType";

interface Props {
  boulder: IBoulder | null;
  isOpen: boolean;
  onClose: () => void;
}

const BoulderDetailsPanel = ({ boulder, isOpen, onClose }: Props) => {
  const { isMobile, isDesktop } = useDeviceType();
  const [ascentType, setAscentType] = useState("");
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
        ascentType,
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
      <Box
        sx={{
          p: isMobile ? 1.25 : 2,
          width: isMobile ? "100vw" : isDesktop ? 440 : 420,
          height: "100dvh",
          bgcolor: "background.default",
          overflowY: "auto",
        }}
      >
        {boulder && (
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={800}>
                {boulder.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {boulder.grade} - {boulder.location}
              </Typography>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6">Log Climb</Typography>

                <FormControl fullWidth>
                  <InputLabel>Ascent</InputLabel>
                  <Select
                    value={ascentType}
                    label="Ascent"
                    onChange={(e) => setAscentType(e.target.value)}
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
                  rows={isMobile ? 3 : 2}
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
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>

              <Divider sx={{ mb: 1.5 }} />

              {loadingHistory ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <List sx={{ pr: 0.5 }}>
                  {history.length > 0 ? (
                    history.map((log) => (
                      <ListItem
                        key={log._id}
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: "1px solid",
                          borderBottomColor: "divider",
                        }}
                      >
                        <ListItemText
                          primary={`${log.user?.username || "Climber"} - ${log.ascentType}`}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ display: "block" }}
                              >
                                {log.comment}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(log.completedAt).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No logs yet.
                    </Typography>
                  )}
                </List>
              )}
            </Paper>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};

export default BoulderDetailsPanel;
