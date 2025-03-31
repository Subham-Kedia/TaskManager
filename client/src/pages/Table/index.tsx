import { useEffect } from "react";
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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, searchTasks } from "@/store/slices/taskSlice";
import { RootState, AppDispatch } from "@/store";
import { getPriorityColor, getStatusColor } from "@utils/table";
import SearchBox from "@/components/SearchBox";

function TaskTable() {
  const dispatch = useDispatch<AppDispatch>();

  const { filteredTasks, loading, error, searchQuery } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // useEffect(() => {
  //   setLocalSearchQuery(searchQuery);
  // }, [searchQuery]);

  const handleSearch = (q: string) => {
    dispatch(searchTasks(q));
  };

  const clearSearch = () => {
    dispatch(searchTasks(""));
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
        <SearchBox
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
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
