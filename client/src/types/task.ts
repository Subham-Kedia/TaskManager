export interface Task {
  id: string;
  title: string;
  description: string;
  completion_date: string | null;
  assignee: string;
  status: "To Do" | "In Progress" | "Completed";
  due_date: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
  estimated_hours: number;
}
