import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  TableBody,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  SelectChangeEvent,
  Stack,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, searchTasks } from "@/store/slices/taskSlice";
import { RootState, AppDispatch } from "@/store";
import { getPriorityColor, getStatusColor } from "@utils/table";
import SearchBox from "@/components/SearchBox";
import Filter from "@/components/Filter";
import InfiniteScroll from "@/components/InfiniteScroll";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableContainer,
} from "@/styles/table";
import { SortDirection, SortableColumn, Task } from "@/types/task";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@utils/table";

const PAGE_SIZE = 15;

function TaskTable() {
  const dispatch = useDispatch<AppDispatch>();

  const { filteredTasks, loading, error, searchQuery } = useSelector(
    (state: RootState) => state.tasks
  );

  // Filter states for multi-select
  const [assigneeFilters, setAssigneeFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // sorting states
  const [sortBy, setSortBy] = useState<SortableColumn>("due_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get unique assignees from tasks
  const [assignees, setAssignees] = useState<string[]>([]);

  // Filtered and sorted tasks state
  const [processedTasks, setProcessedTasks] = useState<Task[]>([]);

  // Displayed tasks (with pagination)
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Extract unique assignees when tasks load
  useEffect(() => {
    if (filteredTasks.length > 0) {
      const uniqueAssignees = [
        ...new Set(filteredTasks.map((task) => task.assignee)),
      ];
      setAssignees(uniqueAssignees);
    }
  }, [filteredTasks]);

  // Apply filters and sorting when filteredTasks or filter/sort states change
  useEffect(() => {
    let result = [...filteredTasks];

    // Apply assignee filter
    if (assigneeFilters.length > 0) {
      result = result.filter((task) => assigneeFilters.includes(task.assignee));
    }

    // Apply status filter
    if (statusFilters.length > 0) {
      result = result.filter((task) => statusFilters.includes(task.status));
    }

    // Apply priority filter
    if (priorityFilters.length > 0) {
      result = result.filter((task) => priorityFilters.includes(task.priority));
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA: any = a[sortBy];
      let valueB: any = b[sortBy];

      // Special handling for dates
      if (sortBy === "due_date") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Handle numeric values
      if (sortBy === "estimated_hours") {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      }

      // Handle text values (case-insensitive)
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Compare values based on sort direction
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });

    setProcessedTasks(result);
    setCurrentPage(1);
    setHasMore(result.length > PAGE_SIZE);
    setDisplayedTasks(result.slice(0, PAGE_SIZE));
  }, [
    filteredTasks,
    assigneeFilters,
    statusFilters,
    priorityFilters,
    sortBy,
    sortDirection,
  ]);

  const loadMoreTasks = (cb: () => void) => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const nextBatch = processedTasks.slice(startIndex, endIndex);
    console.log(startIndex, endIndex, nextBatch);
    if (nextBatch.length > 0) {
      setDisplayedTasks((prev) => [...prev, ...nextBatch]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < processedTasks.length);
    } else {
      setHasMore(false);
    }
    if (cb) {
      cb();
    }
  };

  const handleSearch = (q: string) => {
    dispatch(searchTasks(q));
  };

  const clearSearch = () => {
    dispatch(searchTasks(""));
  };

  // Filter handlers
  const handleAssigneeChange = (
    event: SelectChangeEvent<typeof assigneeFilters>
  ) => {
    const {
      target: { value },
    } = event;
    setAssigneeFilters(typeof value === "string" ? value.split(",") : value);
  };

  const handleStatusChange = (
    event: SelectChangeEvent<typeof statusFilters>
  ) => {
    const {
      target: { value },
    } = event;
    setStatusFilters(typeof value === "string" ? value.split(",") : value);
  };

  const handlePriorityChange = (
    event: SelectChangeEvent<typeof priorityFilters>
  ) => {
    const {
      target: { value },
    } = event;
    setPriorityFilters(typeof value === "string" ? value.split(",") : value);
  };

  const resetFilters = () => {
    setAssigneeFilters([]);
    setStatusFilters([]);
    setPriorityFilters([]);
  };

  // Handle column sorting
  const handleSort = (column: SortableColumn) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Get sort indicator class
  const getSortClass = (column: SortableColumn) => {
    if (sortBy === column) {
      return sortDirection;
    }
    return "";
  };

  // Check if any filters are active
  const hasActiveFilters =
    assigneeFilters.length > 0 ||
    statusFilters.length > 0 ||
    priorityFilters.length > 0;

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
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            color={hasActiveFilters ? "primary" : "inherit"}
          >
            {hasActiveFilters
              ? `Filters (${
                  assigneeFilters.length +
                  statusFilters.length +
                  priorityFilters.length
                })`
              : "Filters"}
          </Button>
          <SearchBox
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
          />
        </Stack>
      </Box>

      {showFilters && (
        <Filter
          assigneeFilters={assigneeFilters}
          statusFilters={statusFilters}
          priorityFilters={priorityFilters}
          assignees={assignees}
          statusOptions={STATUS_OPTIONS}
          priorityOptions={PRIORITY_OPTIONS}
          onAssigneeChange={handleAssigneeChange}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onResetFilters={resetFilters}
          filteredCount={processedTasks.length}
          totalCount={filteredTasks.length}
        />
      )}

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
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <InfiniteScroll
          onLoadMore={loadMoreTasks}
          hasMore={hasMore}
          isLoading={loading}
          height="calc(100vh - 230px)"
          endMessage={processedTasks.length > 0 ? "All tasks loaded" : ""}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell
                    width="200px"
                    className={`sortable ${getSortClass("title")}`}
                    onClick={() => handleSort("title")}
                  >
                    Title
                  </TableHeaderCell>
                  <TableHeaderCell width="300px">Description</TableHeaderCell>
                  <TableHeaderCell
                    width="150px"
                    className={`sortable ${getSortClass("assignee")}`}
                    onClick={() => handleSort("assignee")}
                  >
                    Assignee
                  </TableHeaderCell>
                  <TableHeaderCell
                    width="120px"
                    className={`sortable ${getSortClass("due_date")}`}
                    onClick={() => handleSort("due_date")}
                  >
                    Due Date
                  </TableHeaderCell>
                  <TableHeaderCell
                    width="120px"
                    className={`sortable ${getSortClass("status")}`}
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </TableHeaderCell>
                  <TableHeaderCell
                    width="120px"
                    className={`sortable ${getSortClass("priority")}`}
                    onClick={() => handleSort("priority")}
                  >
                    Priority
                  </TableHeaderCell>
                  <TableHeaderCell width="100px">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody id="table-body">
                {loading && displayedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : displayedTasks.length > 0 ? (
                  displayedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell width="200px">{task.title}</TableCell>
                      <TableCell width="300px">
                        {task.description.substring(0, 50)}
                        {task.description.length > 50 ? "..." : ""}
                      </TableCell>
                      <TableCell width="150px">{task.assignee}</TableCell>
                      <TableCell width="120px">
                        {new Date(task.due_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell width="120px">
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
                      <TableCell width="120px">
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
                      <TableCell width="100px">
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
                      {searchQuery || hasActiveFilters
                        ? "No tasks match your search and filter criteria"
                        : "No tasks available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </InfiniteScroll>

        {displayedTasks.length > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            Showing {displayedTasks.length} of {processedTasks.length} tasks
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default TaskTable;
