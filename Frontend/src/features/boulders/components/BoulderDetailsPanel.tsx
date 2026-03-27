import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
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
  Modal,
  Alert,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { type IBoulder } from "../types/boulder.types";
import { type HistoryItem } from "../../history/types/history.types";

interface Props {
  boulder: IBoulder | null;
  isOpen: boolean;
  onClose: () => void;
}

const BoulderDetailsPanel = ({ boulder, isOpen, onClose }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [ascentType, setAscentType] = useState("");
  const [attempts, setAttempts] = useState(1);
  const [comment, setComment] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

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
      setFeedback({
        open: true,
        severity: "success",
        message: "Climb logged successfully!",
      });
      setComment("");
      fetchHistory();
    } catch (err) {
      console.error("Error logging climb:", err);
      setFeedback({
        open: true,
        severity: "error",
        message: "Failed to log climb. Please try again.",
      });
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100vw", sm: 460, md: 560 },
              maxWidth: "100vw",
              borderTopLeftRadius: { sm: 20 },
              borderBottomLeftRadius: { sm: 20 },
              background:
                "linear-gradient(180deg, rgba(248,252,245,0.96), rgba(236,245,231,0.88))",
              borderLeft: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <Box sx={{ p: { xs: 2.5, sm: 3.5 }, height: "100%", overflow: "auto" }}>
          {boulder && (
            <>
              {boulder.imagesUrl && (
                <Box
                  component="img"
                  src={boulder.imagesUrl}
                  alt={boulder.name}
                  onClick={() => {
                    if (isMobile) {
                      setIsImageFullscreen(true);
                    }
                  }}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: 250,
                    objectFit: "cover",
                    borderRadius: 2,
                    marginBottom: 2.5,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                    cursor: isMobile ? "pointer" : "default",
                    transition: "opacity 0.2s ease",
                    "&:hover": isMobile
                      ? {
                          opacity: 0.9,
                        }
                      : {},
                  }}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {boulder.name}
                </Typography>
                <IconButton
                  aria-label="Close log climb panel"
                  onClick={onClose}
                  sx={{
                    display: { xs: "inline-flex", sm: "none" },
                    mt: -0.5,
                    mr: -0.5,
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                {boulder.grade} - {boulder.location}
              </Typography>

              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
              >
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
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleLogSubmit}
                  sx={{ alignSelf: "flex-start", px: 3 }}
                >
                  Save
                </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

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
                          primary={`${log.user?.username || log.user?.email || "Climber"} - ${log.ascentType}`}
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

      <Modal
        open={isImageFullscreen}
        onClose={() => setIsImageFullscreen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "100vw", sm: "90vw", md: "80vw" },
            height: { xs: "100vh", sm: "90vh" },
            maxWidth: { xs: "100vw", sm: 1000 },
            maxHeight: { xs: "100vh", sm: "90vh" },
          }}
        >
          <Box
            component="img"
            src={boulder?.imagesUrl}
            alt={boulder?.name}
            onClick={() => setIsImageFullscreen(false)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: { xs: 0, sm: 2 },
              cursor: "pointer",
            }}
          />
        </Box>
      </Modal>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BoulderDetailsPanel;
