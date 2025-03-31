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
