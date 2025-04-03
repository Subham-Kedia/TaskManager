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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, searchTasks } from "@store/slices/taskSlice";
import { RootState, AppDispatch } from "@store/index";
import { getPriorityColor, getStatusColor, ALL_COLUMNS } from "@utils/table";
import SearchBox from "@components/SearchBox";
import Filter from "@components/Filter";
import InfiniteScroll from "@components/InfiniteScroll";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableContainer,
} from "@/styles/table";
import { SortDirection, SortableColumn, Task } from "@/types/task";
import FilterAndReOrder, { FilterItem } from "@/components/FilterAndReOrder";

const PAGE_SIZE = 15;

function TaskTable() {
  const dispatch = useDispatch<AppDispatch>();

  const { filteredTasks, loading, error, searchQuery } = useSelector(
    (state: RootState) => state.tasks
  );

  const [assigneeFilters, setAssigneeFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortableColumn>("due_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [assignees, setAssignees] = useState<string[]>([]);
  const [processedTasks, setProcessedTasks] = useState<Task[]>([]);

  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<FilterItem[]>(ALL_COLUMNS);

  const handleColumnChange = (updatedColumns: FilterItem[]) => {
    setColumns(updatedColumns);
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (filteredTasks.length > 0) {
      const uniqueAssignees = [
        ...new Set(filteredTasks.map((task) => task.assignee)),
      ];
      setAssignees(uniqueAssignees);
    }
  }, [filteredTasks]);

  useEffect(() => {
    let result = [...filteredTasks];

    if (assigneeFilters.length > 0) {
      result = result.filter((task) => assigneeFilters.includes(task.assignee));
    }

    if (statusFilters.length > 0) {
      result = result.filter((task) => statusFilters.includes(task.status));
    }

    if (priorityFilters.length > 0) {
      result = result.filter((task) => priorityFilters.includes(task.priority));
    }

    result.sort((a, b) => {
      let valueA: string | number | Date = a[sortBy] as string | number | Date;
      let valueB: string | number | Date = b[sortBy] as string | number | Date;

      if (sortBy === "due_date") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (sortBy === "estimated_hours") {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

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

  const handleSort = (column: SortableColumn) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const getSortClass = (column: SortableColumn) => {
    if (sortBy === column) {
      return sortDirection;
    }
    return "";
  };

  const hasActiveFilters =
    assigneeFilters.length > 0 ||
    statusFilters.length > 0 ||
    priorityFilters.length > 0;

  return (
    <Box mx={2} flex={1} display="flex" flexDirection="column" overflow="auto">
      <Stack direction="row" flexWrap="wrap-reverse" gap={2} mb={2}>
        <FilterAndReOrder columns={columns} onChange={handleColumnChange} />
        <Filter
          assigneeFilters={assigneeFilters}
          statusFilters={statusFilters}
          priorityFilters={priorityFilters}
          assignees={assignees}
          onAssigneeChange={handleAssigneeChange}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onResetFilters={resetFilters}
        />
        <SearchBox
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
      </Stack>

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
                  {columns.map((col) => {
                    switch (col.id) {
                      case "title":
                        return (
                          <TableHeaderCell
                            key={col.id}
                            width="200px"
                            className={`sortable ${getSortClass("title")}`}
                            onClick={() => handleSort("title")}
                          >
                            Title
                          </TableHeaderCell>
                        );
                      case "description":
                        return (
                          <TableHeaderCell key={col.id} width="300px">
                            Description
                          </TableHeaderCell>
                        );
                      case "assignee":
                        return (
                          <TableHeaderCell
                            key={col.id}
                            width="150px"
                            className={`sortable ${getSortClass("assignee")}`}
                            onClick={() => handleSort("assignee")}
                          >
                            Assignee
                          </TableHeaderCell>
                        );
                      case "due_date":
                        return (
                          <TableHeaderCell
                            key={col.id}
                            width="120px"
                            className={`sortable ${getSortClass("due_date")}`}
                            onClick={() => handleSort("due_date")}
                          >
                            Due Date
                          </TableHeaderCell>
                        );
                      case "status":
                        return (
                          <TableHeaderCell
                            key={col.id}
                            width="120px"
                            className={`sortable ${getSortClass("status")}`}
                            onClick={() => handleSort("status")}
                          >
                            Status
                          </TableHeaderCell>
                        );
                      case "priority":
                        return (
                          <TableHeaderCell
                            key={col.id}
                            width="120px"
                            className={`sortable ${getSortClass("priority")}`}
                            onClick={() => handleSort("priority")}
                          >
                            Priority
                          </TableHeaderCell>
                        );
                      case "actions":
                        return (
                          <TableHeaderCell key={col.id} width="100px">
                            Actions
                          </TableHeaderCell>
                        );
                      default:
                        return null;
                    }
                  })}
                </TableRow>
              </TableHead>

              <TableBody id="table-body">
                {loading && displayedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : displayedTasks.length > 0 ? (
                  displayedTasks.map((task) => (
                    <TableRow key={task.id}>
                      {columns.map((col) => {
                        switch (col.id) {
                          case "title":
                            return (
                              <TableCell
                                key={`${task.id}-${col.id}`}
                                width="200px"
                              >
                                {task.title}
                              </TableCell>
                            );
                          case "description":
                            return (
                              <TableCell
                                key={`${task.id}-${col.id}`}
                                width="300px"
                              >
                                {task.description.substring(0, 50)}
                                {task.description.length > 50 ? "..." : ""}
                              </TableCell>
                            );
                          case "assignee":
                            return (
                              <TableCell
                                key={`${task.id}-${col.id}`}
                                width="150px"
                              >
                                {task.assignee}
                              </TableCell>
                            );
                          case "due_date":
                            return (
                              <TableCell
                                key={`${task.id}-${col.id}`}
                                width="120px"
                              >
                                {new Date(task.due_date).toLocaleDateString()}
                              </TableCell>
                            );
                          case "status":
                            return (
                              <TableCell
                                key={`${task.id}-${col.id}`}
                                width="120px"
                              >
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
                            );
                          case "priority":
                            return (
                              <TableCell
                                key={`${task.id}-${col.id}`}
                                width="120px"
                              >
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
                            );
                          case "actions":
                            return (
                              <TableCell
                                key={`${task.id}-${col.id}`}
                                width="100px"
                              >
                                <IconButton size="small" color="primary">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            );
                          default:
                            return null;
                        }
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
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
