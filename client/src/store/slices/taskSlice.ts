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

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTasks();
      return response as Task[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    searchTasks: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;

      if (!action.payload.trim()) {
        state.filteredTasks = state.tasks;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredTasks = state.tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query)
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
        taskSlice.caseReducers.searchTasks(state, {
          payload: state.searchQuery,
          type: "tasks/searchTasks",
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { searchTasks } = taskSlice.actions;

export default taskSlice.reducer;
