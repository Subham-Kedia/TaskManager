import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <ThemeProvider>
      <SnackbarProvider
        autoHideDuration={3000}
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        preventDuplicate
      />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </ReduxProvider>
);
