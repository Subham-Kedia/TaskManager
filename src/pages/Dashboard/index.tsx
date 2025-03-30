import { Typography, Container, Grid, Paper } from "@mui/material";

function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Task Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pending Tasks
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              0
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              In Progress
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              0
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Completed
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              0
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
