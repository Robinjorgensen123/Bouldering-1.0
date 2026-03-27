import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 4,
              p: 3,
              bgcolor: "background.paper",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                Something went wrong
              </Typography>
              <Alert severity="error">
                The app ran into an unexpected UI error.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Try reloading the page. If the problem continues, please sign in
                again.
              </Typography>
              <Button variant="contained" onClick={this.handleReload}>
                Reload app
              </Button>
            </Stack>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
