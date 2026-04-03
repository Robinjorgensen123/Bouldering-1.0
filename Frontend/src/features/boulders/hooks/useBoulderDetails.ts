import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { type HistoryItem } from "../../history/types/history.types";

export const useBoulderDetails = (
  boulderId: string | undefined,
  isOpen: boolean,
) => {
  const [ascentType, setAscentType] = useState("");
  const [attempts, setAttempts] = useState(1);
  const [comment, setComment] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const fetchHistory = useCallback(async () => {
    if (!boulderId) return;
    setLoadingHistory(true);
    try {
      const response = await api.get(`/history/boulder/${boulderId}`);
      setHistory(response.data.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [boulderId]);

  useEffect(() => {
    if (isOpen && boulderId) {
      fetchHistory();
    }
  }, [isOpen, boulderId, fetchHistory]);

  const handleLogSubmit = async () => {
    try {
      await api.post("/history", {
        boulder: boulderId,
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

  const handleDelete = async () => {
    if (!boulderId) return;
    try {
      await api.delete(`/boulders/${boulderId}`);
      setFeedback({
        open: true,
        severity: "success",
        message: "Boulder deleted successfully!",
      });
      return true;
    } catch (err) {
      console.error("Error deleting boulder:", err);
      setFeedback({
        open: true,
        severity: "error",
        message: "Failed to delete boulder.",
      });
      return false;
    }
  };

  const closeFeedback = () => setFeedback((prev) => ({ ...prev, open: false }));

  return {
    state: {
      ascentType,
      attempts,
      comment,
      history,
      loadingHistory,
      feedback,
    },
    handlers: {
      setAscentType,
      setAttempts,
      setComment,
      handleLogSubmit,
      handleDelete,
      closeFeedback,
    },
  };
};
