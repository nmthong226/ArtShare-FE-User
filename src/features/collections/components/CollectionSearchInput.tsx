import React from "react";
import { Paper, Input } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

interface CollectionSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const CollectionSearchInput: React.FC<CollectionSearchInputProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search collections...",
}) => {
  return (
    <Paper
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: { xs: "100%", sm: 300, md: 400 },
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "grey.400",
        boxShadow: "none",
        bgcolor: "background.paper",
        height: 40,
      }}
    >
      <FiSearch style={{ margin: "0 8px", color: "grey.600" }} />
      <Input
        placeholder={placeholder}
        disableUnderline
        fullWidth
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flex: 1, ml: 1 }}
      />
      {searchQuery && (
        <TiDeleteOutline
          style={{
            margin: "0 8px",
            color: "grey.600",
            cursor: "pointer",
            width: 20,
            height: 20,
          }}
          onClick={() => onSearchChange("")}
        />
      )}
    </Paper>
  );
};
