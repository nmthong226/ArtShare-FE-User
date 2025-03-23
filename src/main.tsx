import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { theme } from "./styles.tsx";
import { ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import vi from "javascript-time-ago/locale/vi";
import { FocusProvider } from "./contexts/focus/FocusProvider.tsx";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(vi);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <FocusProvider>
            <App />
          </FocusProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
