import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import { Button, DialogContent, DialogContentText, Input } from "@mui/material";
import { useRef } from "react";
import { CheckIcon, PlusCircleIcon, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

export interface SavePostDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export const SavePostDialog = (props: SavePostDialogProps) => {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const descriptionElementRef = useRef<HTMLElement>(null);

  return (
    <Dialog open={open} onClose={handleClose} scroll={"paper"} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" className="flex items-center justify-between">
        <span>Add project to collection</span>
        <Button className="aspect-[1/1] min-w-auto" onClick={handleClose}>
          <X />
        </Button>
      </DialogTitle>
      <DialogContent dividers={true} className="flex flex-col gap-4 w-[600px] px-0">
        <div className="px-4">
          <Button variant="outlined" className="flex gap-2 items-center p-2">
            <PlusCircleIcon />
            <span className="normal-case font-normal text-md">Create new collection</span>
          </Button>
        </div>

        <div className="px-4">
          <div className=" relative flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl h-10 text-mountain-500 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-mountain-400">
            <FiSearch className="left-2 absolute w-5 h-5" />
            <Input className="shadow-inner pr-8 pl-8 border-1 rounded-2xl w-full" placeholder="Search" disableUnderline />
            <TiDeleteOutline className="right-2 absolute w-5 h-5" />
          </div>
        </div>
        <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
          {[...new Array(10)].map((_, index) => {
            return (
              <div className="flex gap-2 items-center p-2 border-b border-mountain-400" key={index}>
                <img
                  src="https://cdnb.artstation.com/p/channels/covers/000/000/077/20200505141007/thumb/thumb.jpg?1588705807"
                  className="object-cover object-center w-18 aspect-[1/1] rounded-lg border"
                  alt="Thumbnail"
                />
                <div className="flex flex-col gap-1 flex-grow">
                  <div className="font-bold">Collection Name</div>
                  <div className="text-sm">10 projects</div>
                </div>
                {index % 2 === 0 ? (
                  <Button variant="contained" className="normal-case shadow-none font-normal">
                    Add to collection
                  </Button>
                ) : (
                  <Button variant="outlined" className="normal-case shadow-none font-normal flex gap-1 items-center" disableRipple>
                    <CheckIcon size={16} />
                    <span>Added</span>
                  </Button>
                )}
              </div>
            );
          })}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
