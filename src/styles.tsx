import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#a5b4fc",
    },
    secondary: {
      main: "#8F8F8F",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Applies to all buttons
          "&:hover": {
            backgroundColor: "#818cf8", // hover color
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          // This will apply your primary color to all icons
          color: "#a5b4fc",
        },
      },
    },
  },
});
