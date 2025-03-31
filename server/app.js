const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/tasks", (request, response) => {
  try {
    // Read query parameters for pagination
    const limit = parseInt(request.query.limit) || 0; // Default: return all
    const offset = parseInt(request.query.offset) || 0; // Default: start from beginning

    // Read tasks data
    const tasksFilePath = path.join(__dirname, "data", "tasks.json");
    const tasksData = fs.readFileSync(tasksFilePath, "utf8");
    const allTasks = JSON.parse(tasksData);

    // Apply pagination if limit is specified
    let tasks = allTasks;
    if (limit > 0) {
      tasks = allTasks.slice(offset, offset + limit);
    }

    // Return paginated results with metadata
    response.json({
      tasks: tasks,
      pagination: {
        total: allTasks.length,
        offset: offset,
        limit: limit,
        hasMore: limit > 0 && offset + limit < allTasks.length,
      },
    });
  } catch (error) {
    console.error("Error reading tasks:", error);
    response.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

app.listen(8080, () => {
  console.info("server is running on port 8080");
});
