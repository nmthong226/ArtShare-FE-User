import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@/contexts/ThemeProvider"; // Your custom theme context
import { AppThemeProvider } from "./contexts/AppThemeProvider.tsx";
import { FocusProvider } from "./contexts/focus/FocusProvider.tsx";
import "./index.css";
import App from "./App.tsx";
import { SnackbarProvider } from "./contexts/SnackbarProvider.tsx";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import vi from "javascript-time-ago/locale/vi";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(vi);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppThemeProvider>
            <SnackbarProvider>
              <FocusProvider>
                <App />
              </FocusProvider>
            </SnackbarProvider>
          </AppThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StyledEngineProvider>
  </StrictMode>
);
