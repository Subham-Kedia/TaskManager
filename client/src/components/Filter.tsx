import { FilterList } from "@mui/icons-material";
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  SelectChangeEvent,
  Box,
  Popover,
} from "@mui/material";
import { useState } from "react";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/utils/table";

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

export interface FilterConfig {
  id: string;
  label: string;
  options: string[];
  values: string[];
  onChange: (event: SelectChangeEvent<string[]>) => void;
}

interface FilterProps {
  assigneeFilters?: string[];
  statusFilters?: string[];
  priorityFilters?: string[];
  assignees?: string[];
  onAssigneeChange?: (event: SelectChangeEvent<string[]>) => void;
  onStatusChange?: (event: SelectChangeEvent<string[]>) => void;
  onPriorityChange?: (event: SelectChangeEvent<string[]>) => void;
  onResetFilters: () => void;
}

const Filter: React.FC<FilterProps> = ({
  assigneeFilters = [],
  statusFilters = [],
  priorityFilters = [],
  assignees = [],
  onAssigneeChange,
  onStatusChange,
  onPriorityChange,
  onResetFilters,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const hasActiveFilters =
    assigneeFilters.length > 0 ||
    statusFilters.length > 0 ||
    priorityFilters.length > 0;

  const resolvedFilters: FilterConfig[] = [
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
            options: STATUS_OPTIONS,
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
            options: PRIORITY_OPTIONS,
            values: priorityFilters,
            onChange: onPriorityChange,
          },
        ]
      : []),
  ];

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterList />}
        onClick={handleButtonClick}
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

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={2}>
          <Stack direction="column" spacing={2} alignItems="stretch">
            {resolvedFilters.map((filter) => (
              <FormControl
                key={filter.id}
                sx={{ width: 250, flex: 1 }}
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
                  fullWidth
                >
                  {filter.options.map((option) => (
                    <MenuItem key={option} value={option} dense>
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
                mt: { xs: 1, sm: 0 },
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default Filter;
