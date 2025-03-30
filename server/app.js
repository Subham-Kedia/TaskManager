const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.get("/tasks", (request, response) => {
  try {
    const tasksFilePath = path.join(__dirname, "data", "tasks.json");
    const tasksData = fs.readFileSync(tasksFilePath, "utf8");
    const tasks = JSON.parse(tasksData);
    response.json(tasks);
  } catch (error) {
    console.error("Error reading tasks:", error);
    response.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

app.listen(8080, () => {
  console.info("server is running on port 8080");
});
