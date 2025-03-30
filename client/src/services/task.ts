import { taskManagerService } from "./base";
import { Task } from "@/types/task";

export const getTasks = (): Promise<Task[]> => {
  return taskManagerService.get("tasks");
};
