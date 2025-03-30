import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  InputBase,
  alpha,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, searchTasks } from "@/store/slices/taskSlice";
import { RootState, AppDispatch } from "@/store";
import { useTheme } from "@/context/ThemeContext";

function TaskTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { mode } = useTheme();
  const { filteredTasks, loading, error, searchQuery } = useSelector(
    (state: RootState) => state.tasks
  );
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    // Keep local search state in sync with Redux state
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchTasks(localSearchQuery));
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    dispatch(searchTasks(""));
  };

  // Function to get appropriate color for priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  // Function to get appropriate color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "primary";
      case "To Do":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Task List</Typography>

        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            backgroundColor: alpha(
              mode === "light" ? "#f5f5f5" : "#2a2a2a",
              0.7
            ),
            "&:hover": {
              backgroundColor: alpha(
                mode === "light" ? "#e0e0e0" : "#333333",
                0.9
              ),
            },
            pl: 2,
            width: { xs: "100%", sm: "300px" },
            maxWidth: "500px",
          }}
        >
          <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
          <InputBase
            placeholder="Search tasks..."
            sx={{
              flex: 1,
              "& .MuiInputBase-input": {
                py: 1,
              },
            }}
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
          {localSearchQuery && (
            <IconButton size="small" onClick={clearSearch} sx={{ p: "5px" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {searchQuery && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {filteredTasks.length === 0
            ? `No results found for "${searchQuery}"`
            : `Found ${filteredTasks.length} result${
                filteredTasks.length !== 1 ? "s" : ""
              } for "${searchQuery}"`}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    {task.description.substring(0, 50)}
                    {task.description.length > 50 ? "..." : ""}
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>
                    {new Date(task.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={
                        getStatusColor(task.status) as
                          | "success"
                          | "primary"
                          | "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={
                        getPriorityColor(task.priority) as
                          | "error"
                          | "warning"
                          | "success"
                          | "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No tasks available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TaskTable;
