import { useRef, useState } from "react";
import {
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  Box,
} from "@mui/material";
import SubjectSelector from "./SubjectSelector"; // your big selector panel

interface SubjectPickerProps {
  cate_ids: number[];
  setCateIds: (ids: number[]) => void;
}

export default function SubjectPicker({
  cate_ids,
  setCateIds,
}: SubjectPickerProps) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  // close when clicking outside
  const handleClickAway = () => {
    setOpen(false);
  };

  // when selection changes, keep popper open so user can add more
  const handleCateIdsChange = (ids: number[]) => {
    setCateIds(ids);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* readOnly so user must click to open */}
      <TextField
        inputRef={anchorRef}
        fullWidth
        variant="outlined"
        placeholder="Choose art type or search…"
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        slotProps={{
          input: {
            disableUnderline: true,
          },
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorRef.current?.clientWidth }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={4} sx={{ mt: 1, maxHeight: 400, overflow: "auto" }}>
            <SubjectSelector
              cate_ids={cate_ids}
              setCateIds={handleCateIdsChange}
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
