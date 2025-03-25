import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@/context/ThemeProvider"; // Your custom theme context
import { AppThemeProvider } from "./context/AppThemeProvider.tsx";
import "./index.css";
import App from "./App.tsx";
import { SnackbarProvider } from "./context/SnackbarProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        {" "}
        {/* Provides theme state and toggle function */}
        <AppThemeProvider>
          {" "}
          {/* Dynamically applies MUI theme */}
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </QueryClientProvider>
        </AppThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
