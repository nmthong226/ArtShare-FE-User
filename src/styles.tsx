import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
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
              borderColor: "#9d9d9d", // mountain-400
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
          },
          "& .MuiInputBase-inputMultiline": {
            padding: "0px", // specifically override <textarea> padding to avoid duplicate padding
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
  },
});
