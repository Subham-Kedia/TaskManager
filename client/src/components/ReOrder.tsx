import { Box, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { FilterItem } from "./FilterAndReOrder";
import { useState } from "react";

interface ReOrderProps {
  items: FilterItem[];
  onChange: (items: FilterItem[]) => void;
}

const ReOrder: React.FC<ReOrderProps> = ({ items, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(draggedIndex, 1);
    reorderedItems.splice(index, 0, movedItem);

    setDraggedIndex(index);
    onChange(reorderedItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        minHeight: 100,
        p: 1,
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(event) => handleDragOver(event, index)}
          onDragEnd={handleDragEnd}
          sx={{
            userSelect: "none",
            p: 1,
            mb: 1,
            border: "1px solid",
            borderRadius: 1,
            borderColor: "divider",
            bgcolor:
              draggedIndex === index ? "primary.light" : "background.paper",
            "&:hover": {
              bgcolor: "action.hover",
            },
            display: "flex",
            alignItems: "center",
            cursor: "grab",
          }}
        >
          <Typography variant="body2">
            <DragIndicatorIcon
              fontSize="inherit"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ReOrder;
