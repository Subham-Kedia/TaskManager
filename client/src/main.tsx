import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store/index.ts";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <ThemeProvider>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        preventDuplicate
      />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </ReduxProvider>
);
