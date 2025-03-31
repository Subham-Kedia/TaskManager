import { useEffect } from "react";
import {
  Typography,
  Paper,
  TableBody,
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
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "@/styles/table";

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
    <Box mx={4} flex={1} display="flex" flexDirection="column" overflow="auto">
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
      <Paper
        sx={{
          mb: 2,
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Assignee</TableHeaderCell>
              <TableHeaderCell>Due Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Priority</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody id="table-body" sx={{ flex: 1, overflow: "auto" }}>
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
      </Paper>
    </Box>
  );
}

export default TaskTable;
