import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";

interface HistoryRecord {
  _id: string;
  ascentType?: string;
  attempts?: number;
  comment?: string;
  completedAt?: string;
  boulder: {
    name: string;
    grade: string;
  } | null;
}

const HistoryPageContent = () => {
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history");
        if (response.data.success) {
          setHistoryRecords(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.gradingSystem]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={32} />
          <Typography>Loading...</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 6,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(135deg, rgba(255,250,244,0.94), rgba(236,227,214,0.72))",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={1.5}>
              <Chip
                label="Your logbook"
                color="secondary"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Climbing History
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Review your recent sends, attempts, and notes across logged
                  boulders.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {historyRecords.length === 0 ? (
          <Alert severity="info">No history records found.</Alert>
        ) : (
          <List disablePadding sx={{ display: "grid", gap: 2 }}>
            {historyRecords.map((record) => (
              <ListItem key={record._id} disableGutters disablePadding>
                <Card
                  elevation={0}
                  sx={{
                    width: "100%",
                    borderRadius: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "rgba(255,250,244,0.72)",
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={1.5}
                      >
                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            {record.boulder
                              ? `${record.boulder.name} (${record.boulder.grade})`
                              : "Deleted boulder"}
                          </Typography>
                        </Box>
                        {record.completedAt && (
                          <Chip
                            icon={<CalendarMonthRoundedIcon />}
                            label={new Date(
                              record.completedAt,
                            ).toLocaleDateString()}
                            variant="outlined"
                            color="secondary"
                            sx={{
                              alignSelf: { xs: "flex-start", sm: "center" },
                            }}
                          />
                        )}
                      </Stack>

                      <Divider />

                      <Stack spacing={1.25}>
                        {record.ascentType && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <SellRoundedIcon fontSize="small" color="primary" />
                            <Typography>{record.ascentType}</Typography>
                          </Stack>
                        )}
                        {record.attempts !== undefined && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <EmojiEventsRoundedIcon
                              fontSize="small"
                              color="primary"
                            />
                            <Typography>{record.attempts} attempts</Typography>
                          </Stack>
                        )}
                        {record.comment && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                          >
                            <ChatBubbleOutlineRoundedIcon
                              fontSize="small"
                              color="primary"
                              sx={{ mt: 0.25 }}
                            />
                            <Typography>{record.comment}</Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Container>
  );
};

export default HistoryPageContent;
