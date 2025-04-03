import React, { useState, useEffect } from "react";
import {
  Button,
  Popover,
  Box,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stack,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ReOrder from "./ReOrder";
import { ALL_COLUMNS, getFilterColumns } from "@utils/table";

export interface FilterItem {
  id: string;
  label: string;
  selected?: boolean;
}

interface FilterAndReOrderProps {
  buttonText?: string;
  columns: FilterItem[];
  onChange: (items: FilterItem[]) => void;
  defaultSelectedIds?: string[];
  defaultOrder?: string[];
  showFilterTitle?: boolean;
  showReorderTitle?: boolean;
}

const FilterAndReOrder: React.FC<FilterAndReOrderProps> = ({
  buttonText = "Columns",
  columns,
  onChange,
  showFilterTitle = true,
  showReorderTitle = true,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterItems, setFilterItems] = useState<FilterItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<FilterItem[]>(columns);

  useEffect(() => {
    setFilterItems(getFilterColumns(ALL_COLUMNS, columns));
    setOrderedItems(columns);
  }, [columns]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (checked: boolean, id: string) => {
    setFilterItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );

    setOrderedItems((items) => {
      if (checked) {
        return [
          ...items,
          ALL_COLUMNS.find((item) => item.id === id) as FilterItem,
        ];
      } else return items.filter((item) => item.id !== id);
    });
  };

  const handleReorder = (reorderedItems: FilterItem[]) => {
    console.log("Reordered items:", reorderedItems);
    setOrderedItems(reorderedItems);
  };

  const handleApply = () => {
    onChange(orderedItems);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "filter-reorder-popover" : undefined;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={handleClick}
        color={columns.length > 0 ? "primary" : "inherit"}
      >
        {columns.length > 0 ? `${buttonText} (${columns.length})` : buttonText}
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
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            height: 400,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">Filter and Reorder</Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Box
            sx={{
              width: "50%",
              borderRight: 1,
              borderColor: "divider",
              p: 2,
              overflow: "auto",
            }}
          >
            {showFilterTitle && (
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select Items
              </Typography>
            )}

            <FormGroup>
              {filterItems.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      checked={item.selected}
                      onChange={(event) =>
                        handleToggle(event.target.checked, item.id)
                      }
                    />
                  }
                  label={item.label}
                  sx={{ fontSize: "typography.body2.fontSize" }}
                />
              ))}
            </FormGroup>
          </Box>

          <Box sx={{ width: "50%", p: 2, overflow: "auto" }}>
            {showReorderTitle && (
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Reorder Selected Items
              </Typography>
            )}

            {orderedItems.length > 0 ? (
              <ReOrder items={orderedItems} onChange={handleReorder} />
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 4 }}
              >
                Select items to reorder them
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              disabled={orderedItems.length === 0}
            >
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default FilterAndReOrder;
