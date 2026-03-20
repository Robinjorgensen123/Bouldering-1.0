import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#245A4B",
      dark: "#183A37",
      light: "#3D7A69",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#D97706",
      dark: "#B45309",
      light: "#F59E0B",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#EAF1ED",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#182322",
      secondary: "#51605E",
    },
    success: {
      main: "#2E7D32",
    },
    warning: {
      main: "#C56800",
      light: "#FFE7C2",
      dark: "#7A4100",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: -0.3,
    },
    h5: {
      fontWeight: 750,
      letterSpacing: -0.2,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: 0,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          backgroundColor: "#EAF1ED",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(24,58,55,0.08)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.88)",
          color: "#182322",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(24,58,55,0.16)",
          borderRadius: 14,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,250,247,0.92))",
          boxShadow: "0 10px 24px rgba(24,58,55,0.08)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #245A4B, #D97706)",
            opacity: 0.85,
          },
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 14px 26px rgba(24,58,55,0.12)",
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        rounded: {
          borderRadius: 14,
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,252,249,0.94))",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 11,
          paddingInline: 14,
        },
        containedPrimary: {
          boxShadow: "0 6px 16px rgba(36,90,75,0.22)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "medium",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
