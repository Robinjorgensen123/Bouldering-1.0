import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2f5d3a",
      light: "#6f9772",
      dark: "#1d3a26",
      contrastText: "#f2f7f0",
    },
    secondary: {
      main: "#3d6b5a",
      light: "#7aa08f",
      dark: "#24453a",
    },
    background: {
      default: "#e8efe4",
      paper: "rgba(247, 250, 245, 0.88)",
    },
    text: {
      primary: "#1d2a21",
      secondary: "#4b6255",
    },
    divider: "rgba(46, 79, 62, 0.16)",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(96, 136, 94, 0.18), transparent 32%), radial-gradient(circle at top right, rgba(52, 95, 79, 0.16), transparent 28%), linear-gradient(180deg, #edf4e9 0%, #e2ecdd 100%)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(135deg, rgba(120, 156, 108, 0.9), rgba(224, 236, 216, 0.84))",
          color: "#1d2a21",
          borderBottom: "1px solid rgba(46, 79, 62, 0.14)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 18px 40px rgba(30, 54, 39, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 50px rgba(30, 54, 39, 0.1)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          minHeight: 44,
        },
        contained: {
          boxShadow: "0 14px 28px rgba(38, 78, 51, 0.24)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.58)",
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
