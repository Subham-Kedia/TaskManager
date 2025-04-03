import { FilterItem } from "@/components/FilterAndReOrder";

export const getPriorityColor = (priority: string) => {
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

export const getStatusColor = (status: string) => {
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

export const STATUS_OPTIONS = ["To Do", "In Progress", "Completed"];
export const PRIORITY_OPTIONS = ["high", "medium", "low"];
export const ALL_COLUMNS = [
  { id: "title", label: "Title", selected: true },
  { id: "description", label: "Description", selected: true },
  { id: "assignee", label: "Assignee", selected: true },
  { id: "due_date", label: "Due Date", selected: true },
  { id: "status", label: "Status", selected: true },
  { id: "priority", label: "Priority", selected: true },
  { id: "actions", label: "Actions", selected: true },
];

export const getFilterColumns = (
  items: FilterItem[],
  selected: FilterItem[]
): FilterItem[] => {
  const ids = selected.map((item) => item.id);
  return items.map((item) =>
    ids.includes(item.id)
      ? { ...item, selected: true }
      : { ...item, selected: false }
  );
};
