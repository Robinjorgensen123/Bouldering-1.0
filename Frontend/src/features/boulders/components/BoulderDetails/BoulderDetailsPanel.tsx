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
import { useState } from "react";
import { type IBoulder } from "../../types/boulder.types";
import { useBoulderDetails } from "../../hooks/useBoulderDetails";
import { useAuth } from "../../../auth/hooks/useAuth";

interface Props {
  boulder: IBoulder | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

const BoulderDetailsPanel = ({
  boulder,
  isOpen,
  onClose,
  onDeleted,
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const { state, handlers } = useBoulderDetails(boulder?._id, isOpen);
  const { user } = useAuth();
  const isAuthor = !!(user && boulder?.author && user._id === boulder.author);

  let absPoints: { x: number; y: number }[] = [];
  if (
    boulder?.topoData?.linePoints &&
    Array.isArray(boulder.topoData.linePoints) &&
    boulder.topoData.linePoints.length > 1
  ) {
    absPoints = boulder.topoData.linePoints.map((pt: any) => ({
      x: pt.x * 1000,
      y: pt.y * 1000,
    }));
  }

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
                  sx={{
                    position: "relative",
                    width: "100%",
                    marginBottom: 2.5,
                  }}
                >
                  <Box
                    component="img"
                    src={
                      boulder.imagesUrl.includes("res.cloudinary.com")
                        ? boulder.imagesUrl.replace(
                            "/upload/",
                            "/upload/f_auto,q_auto/",
                          )
                        : boulder.imagesUrl
                    }
                    alt={boulder.name}
                    onClick={() => isMobile && setIsImageFullscreen(true)}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: 250,
                      objectFit: "cover",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                      cursor: isMobile ? "pointer" : "default",
                      transition: "opacity 0.2s ease",
                      "&:hover": isMobile ? { opacity: 0.9 } : {},
                    }}
                  />
                  {absPoints.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                      }}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="none"
                      >
                        <polyline
                          points={absPoints
                            .map((pt) => `${pt.x},${pt.y}`)
                            .join(" ")}
                          fill="none"
                          stroke="#e53935"
                          strokeWidth="8"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Box>
                  )}
                </Box>
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
                  onClick={onClose}
                  aria-label="Close log climb panel"
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
                    value={state.ascentType}
                    label="Ascent"
                    onChange={(e) => handlers.setAscentType(e.target.value)}
                  >
                    <MenuItem value="flash">Flash</MenuItem>
                    <MenuItem value="onsight">Onsight</MenuItem>
                    <MenuItem value="redpoint">Redpoint</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Attempts"
                  type="number"
                  value={state.attempts}
                  onChange={(e) => handlers.setAttempts(Number(e.target.value))}
                />

                <TextField
                  label="Comment"
                  multiline
                  rows={2}
                  value={state.comment}
                  onChange={(e) => handlers.setComment(e.target.value)}
                />

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handlers.handleLogSubmit}
                    sx={{ px: 3 }}
                  >
                    Save
                  </Button>
                  {isAuthor && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={async () => {
                        const ok = await handlers.handleDelete();
                        if (ok) {
                          onClose();
                          onDeleted?.();
                        }
                      }}
                      sx={{ px: 3 }}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>

              {state.loadingHistory ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <List>
                  {state.history.length > 0 ? (
                    state.history.map((log: any) => (
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
                              <br />
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
            maxWidth: 1000,
          }}
        >
          <Box
            component="img"
            src={
              boulder?.imagesUrl?.includes("res.cloudinary.com")
                ? boulder.imagesUrl.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto/",
                  )
                : boulder?.imagesUrl
            }
            alt={boulder?.name}
            onClick={() => setIsImageFullscreen(false)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </Box>
      </Modal>

      <Snackbar
        open={state.feedback.open}
        autoHideDuration={3000}
        onClose={handlers.closeFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handlers.closeFeedback}
          severity={state.feedback.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {state.feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BoulderDetailsPanel;
