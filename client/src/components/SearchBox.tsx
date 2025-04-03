import { useState } from "react";
import { Paper, InputBase, IconButton, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@context/ThemeContext";

interface SearchBoxProps {
  handleSearch: (q: string) => void;
  clearSearch: () => void;
  searchQuery: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery,
  handleSearch,
  clearSearch,
}) => {
  const { mode } = useTheme();
  const [query, setQuery] = useState(searchQuery);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const onClear = () => {
    setQuery("");
    clearSearch();
  };

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        backgroundColor: alpha(mode === "light" ? "#f5f5f5" : "#2a2a2a", 0.7),
        "&:hover": {
          backgroundColor: alpha(mode === "light" ? "#e0e0e0" : "#333333", 0.9),
        },
        pl: 2,
        width: { xs: "100%", sm: "300px" },
        maxWidth: "500px",
      }}
    >
      <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
      <InputBase
        placeholder="Search tasks..."
        sx={{
          flex: 1,
          "& .MuiInputBase-input": {
            py: 1,
          },
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <IconButton size="small" onClick={onClear} sx={{ p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBox;
