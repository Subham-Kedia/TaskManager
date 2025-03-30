import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "@/context/ThemeContext";

function Layout() {
  const location = useLocation();
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Button
            component={Link}
            to="/dashboard"
            color="inherit"
            sx={{
              mx: 1,
              fontWeight:
                location.pathname === "/dashboard" ? "bold" : "normal",
            }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/table"
            color="inherit"
            sx={{
              mx: 1,
              fontWeight: location.pathname === "/table" ? "bold" : "normal",
            }}
          >
            Tasks
          </Button>
          <Tooltip
            title={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <IconButton
              color="inherit"
              onClick={toggleColorMode}
              sx={{ ml: 1 }}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
