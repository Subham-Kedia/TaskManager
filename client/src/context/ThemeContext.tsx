import React, { createContext, useState, useMemo, useContext } from "react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  responsiveFontSizes,
  PaletteMode,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as SCThemeProvider } from "styled-components";

// Define context type
type ThemeContextType = {
  mode: PaletteMode;
  toggleColorMode: () => void;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

// Hook to use theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get saved theme from localStorage
  const getSavedTheme = (): PaletteMode => {
    const savedTheme = localStorage.getItem("themeMode");
    return (savedTheme as PaletteMode) || "light";
  };

  const [mode, setMode] = useState<PaletteMode>(getSavedTheme);

  // Toggle between light and dark modes
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  // Generate the theme based on current mode
  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode,
        ...(mode === "light"
          ? {
              // Light mode colors
              primary: {
                main: "#3f51b5",
                light: "#757de8",
                dark: "#002984",
                contrastText: "#ffffff",
              },
              secondary: {
                main: "#f50057",
                light: "#ff5983",
                dark: "#bb002f",
                contrastText: "#ffffff",
              },
              background: {
                default: "#f5f5f5",
                paper: "#ffffff",
              },
              text: {
                primary: "rgba(0, 0, 0, 0.87)",
                secondary: "rgba(0, 0, 0, 0.6)",
              },
            }
          : {
              // Dark mode colors
              primary: {
                main: "#757de8",
                light: "#a4ade9",
                dark: "#3f51b5",
                contrastText: "#ffffff",
              },
              secondary: {
                main: "#ff5983",
                light: "#ff8eb3",
                dark: "#c4005a",
                contrastText: "#ffffff",
              },
              background: {
                default: "#121212",
                paper: "#1e1e1e",
              },
              text: {
                primary: "rgba(255, 255, 255, 0.87)",
                secondary: "rgba(255, 255, 255, 0.6)",
              },
            }),
      },
      typography: {
        fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(
          ","
        ),
        h1: { fontSize: "2.5rem", fontWeight: 500 },
        h2: { fontSize: "2rem", fontWeight: 500 },
        h3: { fontSize: "1.75rem", fontWeight: 500 },
        h4: { fontSize: "1.5rem", fontWeight: 500 },
        h5: { fontSize: "1.25rem", fontWeight: 500 },
        h6: { fontSize: "1rem", fontWeight: 500 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 8,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow:
                mode === "dark"
                  ? "0 2px 8px rgba(0, 0, 0, 0.5)"
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    });

    return responsiveFontSizes(baseTheme);
  }, [mode]);

  // Context value
  const contextValue = useMemo(() => {
    return {
      mode,
      toggleColorMode,
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <SCThemeProvider theme={theme}>
        <CssBaseline />
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MUIThemeProvider>
      </SCThemeProvider>
    </ThemeContext.Provider>
  );
};
