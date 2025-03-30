import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks } from "@/services/task";
import { Task } from "@/types/task";

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  searchQuery: "",
  loading: false,
  error: null,
};

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTasks();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? "Completed" : "In Progress";
        task.completion_date = task.completed ? new Date().toISOString() : null;
      }
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "To Do" | "In Progress" | "Completed";
      }>
    ) => {
      const { id, status } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.status = status;
        // Update completed flag and completion_date based on status
        task.completed = status === "Completed";
        task.completion_date =
          status === "Completed" ? new Date().toISOString() : null;
      }
    },
    searchTasks: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;

      if (!action.payload.trim()) {
        state.filteredTasks = state.tasks;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredTasks = state.tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.assignee.toLowerCase().includes(query) ||
            task.status.toLowerCase().includes(query) ||
            task.priority.toLowerCase().includes(query)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.filteredTasks = action.payload; // Initialize filtered tasks
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  updateTaskStatus,
  searchTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
