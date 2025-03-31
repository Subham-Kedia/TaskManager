import { useEffect, useState } from "react";
import { Typography, Container, Grid, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { fetchTasks } from "@/store/slices/taskSlice";

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [completionChartData, setCompletionChartData] = useState<{
    dates: string[];
    counts: number[];
  }>({
    dates: [],
    counts: [],
  });

  const [dueChartData, setDueChartData] = useState<{
    dates: string[];
    counts: number[];
  }>({
    dates: [],
    counts: [],
  });

  const [hoursDistribution, setHoursDistribution] = useState<{
    labels: string[];
    data: number[];
    colors: string[];
  }>({
    labels: [],
    data: [],
    colors: [],
  });

  useEffect(() => {
    if (tasks.length > 0) return;
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (tasks.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[date.getMonth()];
      return `${day} ${month}`;
    };

    const next10Days: Date[] = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next10Days.push(date);
    }

    const formattedNext10Days = next10Days.map(formatDate);
    const completedTasks = tasks.filter((task) => task.status === "Completed");

    const tasksByDate = completedTasks.reduce(
      (acc: Record<string, number>, task) => {
        if (!task.completion_date) return acc;

        const date = new Date(task.completion_date);
        date.setHours(0, 0, 0, 0);

        if (date >= today) {
          const formattedDate = formatDate(date);
          acc[formattedDate] = (acc[formattedDate] || 0) + 1;
        }

        return acc;
      },
      {}
    );

    const completionCounts = formattedNext10Days.map((date) => {
      return tasksByDate[date] || 0;
    });

    let cumulativeCount = 0;
    const cumulativeCounts = completionCounts.map((count) => {
      cumulativeCount += count;
      return cumulativeCount;
    });

    setCompletionChartData({
      dates: formattedNext10Days,
      counts: cumulativeCounts,
    });

    const dueTasks = tasks.filter((task) => task.status !== "Completed");

    const tasksByDueDate = dueTasks.reduce(
      (acc: Record<string, number>, task) => {
        if (!task.due_date) return acc;

        const date = new Date(task.due_date);
        date.setHours(0, 0, 0, 0);

        if (date >= today) {
          const formattedDate = formatDate(date);
          acc[formattedDate] = (acc[formattedDate] || 0) + 1;
        }

        return acc;
      },
      {}
    );

    const dueCounts = formattedNext10Days.map((date) => {
      return tasksByDueDate[date] || 0;
    });

    setDueChartData({
      dates: formattedNext10Days,
      counts: dueCounts,
    });

    const processHoursDistribution = () => {
      const buckets = {
        "Small (0-4h)": { count: 0, color: "#8dd1e1" },
        "Medium (5-12h)": { count: 0, color: "#82ca9d" },
        "Large (13-24h)": { count: 0, color: "#a4de6c" },
        "XLarge (25-48h)": { count: 0, color: "#d0ed57" },
      };

      tasks.forEach((task) => {
        const hours = task.estimated_hours || 0;

        if (hours <= 4) {
          buckets["Small (0-4h)"].count++;
        } else if (hours <= 12) {
          buckets["Medium (5-12h)"].count++;
        } else if (hours <= 24) {
          buckets["Large (13-24h)"].count++;
        } else {
          buckets["XLarge (25-48h)"].count++;
        }
      });

      const labels = Object.keys(buckets);
      const data = labels.map(
        (label) => buckets[label as keyof typeof buckets].count
      );
      const colors = labels.map(
        (label) => buckets[label as keyof typeof buckets].color
      );

      const nonZeroIndexes = data
        .map((value, index) => (value > 0 ? index : -1))
        .filter((index) => index !== -1);

      setHoursDistribution({
        labels: nonZeroIndexes.map((index) => labels[index]),
        data: nonZeroIndexes.map((index) => data[index]),
        colors: nonZeroIndexes.map((index) => colors[index]),
      });
    };

    processHoursDistribution();
  }, [tasks]);

  const todoCount = tasks.filter((task) => task.status === "To Do").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Task Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 350,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tasks Completed Over Time
            </Typography>
            {completionChartData.dates.length > 0 ? (
              <LineChart
                series={[
                  {
                    data: completionChartData.counts,
                    label: "Completed Tasks",
                    color: "#4caf50",
                    curve: "linear",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: completionChartData.dates,
                    label: "Date",
                  },
                ]}
                yAxis={[
                  {
                    label: "Tasks Completed",
                    min: 0,
                    max: Math.max(...completionChartData.counts) + 1,
                    // tickValues: Array.from(
                    //   { length: Math.max(...dueChartData.counts, 1) + 2 },
                    //   (_, i) => i
                    // ),
                    // steps: 1,
                  },
                ]}
                height={280}
                margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
                slotProps={{
                  legend: {
                    position: { vertical: "top", horizontal: "right" },
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No completed tasks to display
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 350,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tasks Due By Day
            </Typography>
            {dueChartData.dates.length > 0 ? (
              <LineChart
                series={[
                  {
                    data: dueChartData.counts,
                    label: "Due Tasks",
                    color: "#ff9800",
                    curve: "natural",
                    showMark: true,
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: dueChartData.dates,
                    label: "Due Date",
                  },
                ]}
                yAxis={[
                  {
                    label: "Number of Tasks",
                    min: 0,
                    max: Math.max(...dueChartData.counts, 1) + 1,
                    tickInterval: 1,
                    steps: 1,
                  },
                ]}
                height={280}
                margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
                slotProps={{
                  legend: {
                    position: { vertical: "top", horizontal: "right" },
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No due tasks to display
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* New Pie Chart for Task Hours Distribution */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 350,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Task Effort Distribution
            </Typography>
            {hoursDistribution.data.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: hoursDistribution.labels.map((label, index) => ({
                      id: index,
                      value: hoursDistribution.data[index],
                      label: label,
                      color: hoursDistribution.colors[index],
                    })),
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 1,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 270,
                    cx: 150,
                    cy: 150,
                  },
                ]}
                height={280}
                margin={{ top: 10, bottom: 10, left: 50, right: 50 }}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    labelStyle: {
                      fontSize: 14,
                    },
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No task data to display
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              To Do
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ff9800",
              }}
            >
              {todoCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              In Progress
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2196f3",
              }}
            >
              {inProgressCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Completed
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4caf50",
              }}
            >
              {completedCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
