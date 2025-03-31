import {
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Typography,
  SelectChangeEvent,
  Box,
} from "@mui/material";

// Dropdown select styles
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Filter configuration interface
export interface FilterConfig {
  id: string;
  label: string;
  options: string[];
  values: string[];
  onChange: (event: SelectChangeEvent<string[]>) => void;
}

interface FilterProps {
  // Can be used with direct props
  assigneeFilters?: string[];
  statusFilters?: string[];
  priorityFilters?: string[];

  assignees?: string[];
  statusOptions?: string[];
  priorityOptions?: string[];

  onAssigneeChange?: (event: SelectChangeEvent<string[]>) => void;
  onStatusChange?: (event: SelectChangeEvent<string[]>) => void;
  onPriorityChange?: (event: SelectChangeEvent<string[]>) => void;

  // Or with custom filter configs
  filters?: FilterConfig[];

  // Common props
  onResetFilters: () => void;
  filteredCount?: number;
  totalCount?: number;
  variant?: "paper" | "outlined" | "plain";
  orientation?: "horizontal" | "vertical";
}

const Filter: React.FC<FilterProps> = ({
  // Traditional direct props
  assigneeFilters = [],
  statusFilters = [],
  priorityFilters = [],
  assignees = [],
  statusOptions = [],
  priorityOptions = [],
  onAssigneeChange,
  onStatusChange,
  onPriorityChange,

  // Config-based props
  filters = [],

  // Common props
  onResetFilters,
  filteredCount,
  totalCount,
  variant = "paper",
  orientation = "horizontal",
}) => {
  // Check if any filters are active
  const hasActiveFilters =
    assigneeFilters.length > 0 ||
    statusFilters.length > 0 ||
    priorityFilters.length > 0 ||
    filters.some((filter) => filter.values.length > 0);

  // Convert traditional props to filter configs if needed
  const resolvedFilters: FilterConfig[] =
    filters.length > 0
      ? filters
      : [
          ...(onAssigneeChange
            ? [
                {
                  id: "assignee",
                  label: "Assignee",
                  options: assignees,
                  values: assigneeFilters,
                  onChange: onAssigneeChange,
                },
              ]
            : []),
          ...(onStatusChange
            ? [
                {
                  id: "status",
                  label: "Status",
                  options: statusOptions,
                  values: statusFilters,
                  onChange: onStatusChange,
                },
              ]
            : []),
          ...(onPriorityChange
            ? [
                {
                  id: "priority",
                  label: "Priority",
                  options: priorityOptions,
                  values: priorityFilters,
                  onChange: onPriorityChange,
                },
              ]
            : []),
        ];

  // Get the wrapper component based on variant
  const WrapperComponent = variant === "paper" ? Paper : Box;
  const wrapperProps =
    variant === "paper"
      ? { sx: { p: 2, mb: 2 } }
      : variant === "outlined"
      ? {
          sx: {
            p: 2,
            mb: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          },
        }
      : { sx: { mb: 2 } };

  return (
    <WrapperComponent {...wrapperProps}>
      <Stack
        direction={
          orientation === "horizontal" ? { xs: "column", sm: "row" } : "column"
        }
        spacing={2}
        sx={{ mb: 2 }}
        alignItems={
          orientation === "horizontal"
            ? { xs: "stretch", sm: "center" }
            : "stretch"
        }
      >
        {resolvedFilters.map((filter) => (
          <FormControl
            key={filter.id}
            sx={{ minWidth: 200, flex: 1 }}
            size="small"
          >
            <InputLabel id={`${filter.id}-filter-label`}>
              {filter.label}
            </InputLabel>
            <Select
              labelId={`${filter.id}-filter-label`}
              id={`${filter.id}-filter`}
              multiple
              value={filter.values}
              onChange={filter.onChange}
              input={<OutlinedInput label={filter.label} />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {filter.options.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={filter.values.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Button
          variant="outlined"
          onClick={onResetFilters}
          size="small"
          disabled={!hasActiveFilters}
          sx={{
            mt: orientation === "horizontal" ? { xs: 1, sm: 0 } : 1,
            alignSelf:
              orientation === "horizontal"
                ? { xs: "flex-start", sm: "center" }
                : "flex-start",
          }}
        >
          Reset
        </Button>
      </Stack>

      {filteredCount !== undefined &&
        totalCount !== undefined &&
        filteredCount !== totalCount && (
          <Typography variant="body2" color="text.secondary">
            Found {filteredCount} of {totalCount} items after filtering
          </Typography>
        )}
    </WrapperComponent>
  );
};

export default Filter;
