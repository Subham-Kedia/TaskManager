import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store";
import theme from "./config/theme";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <ThemeProvider theme={theme}>
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
