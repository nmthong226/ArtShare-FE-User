import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: 'dark', // Explicitly set mode to dark
    primary: {
      main: "#a5b4fc",
    },
    secondary: {
      main: "#8F8F8F",
    },
    mountain: {
      100: "#e7e7e7",
      400: "#9ca3af",
    },
    background: {
      default: "#121212", // Dark background color
      paper: "#262626", // Darker paper color
    },
    text: {
      primary: "#ffffff", // White text for dark mode
      secondary: "#9ca3af", // Lighter text color for secondary elements
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#818cf8",
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#a5b4fc",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#262626",
            "& fieldset": {
              borderColor: "#9ca3af", // mountain-400
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "#e7e7e7", // mountain-100
              borderWidth: "2px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#e7e7e7", // primary.main on focus
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input": {
            padding: "10px",
            color: "#ffffff",
          },
          "& .MuiInputBase-inputMultiline": {
            padding: "0px",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#262626",
        },
        input: {
          color: "#ffffff",
          padding: "10px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#262626",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#262626",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#262626",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#262626",
        }
      }
    }
  },
});
