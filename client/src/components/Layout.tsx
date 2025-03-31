import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@context/ThemeContext";
import { PageContainer } from "@styles/common";
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import { PATHS } from "@config/path";

function Layout() {
  const location = useLocation();
  const { mode, toggleColorMode } = useTheme();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              mr: { xs: 2, md: 0 },
            }}
          >
            Task Manager
          </Typography>
          <Box sx={{ display: "flex", ml: "auto" }}>
            <Button
              component={Link}
              to={PATHS.DASHBOARD}
              color="inherit"
              sx={{
                mx: 1,
                fontWeight:
                  location.pathname === PATHS.DASHBOARD ? "bold" : "normal",
              }}
            >
              Dashboard
            </Button>
            <Button
              component={Link}
              to={PATHS.TABLE}
              color="inherit"
              sx={{
                mx: 1,
                fontWeight:
                  location.pathname === PATHS.TABLE ? "bold" : "normal",
              }}
            >
              Tasks
            </Button>
            <IconButtonWithTooltip
              title={
                mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              handleClick={toggleColorMode}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButtonWithTooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}

export default Layout;
