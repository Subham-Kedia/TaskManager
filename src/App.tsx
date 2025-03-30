import { Routes, Route, Navigate } from "react-router";
import { Box } from "@mui/material";
import Dashboard from "@pages/Dashboard";
import TaskTable from "@pages/Table";
import Layout from "./components/Layout";

function App() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/table" element={<TaskTable />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
