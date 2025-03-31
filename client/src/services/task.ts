import { taskManagerService } from "./base";

export const getTasks = async (offset?: number, limit?: number) => {
  try {
    const params: Record<string, any> = {};
    if (offset !== undefined) params.offset = offset;
    if (limit !== undefined) params.limit = limit;

    const response = await taskManagerService.get("tasks", {
      params,
    });

    if (offset === undefined && limit === undefined) {
      return response.data.tasks;
    }

    return {
      tasks: response.data.tasks,
      pagination: response.data.pagination,
    };
  } catch (err) {
    console.log(err);
  }
};
