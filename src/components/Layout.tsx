import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router";

function Layout() {
  const location = useLocation();

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
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
