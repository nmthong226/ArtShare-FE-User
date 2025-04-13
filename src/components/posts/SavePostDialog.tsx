import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  DialogContent,
  DialogContentText,
  Input,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useRef } from "react";
import { CheckIcon, PlusCircleIcon, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

export interface SavePostDialogProps {
  open: boolean;
  onClose: () => void;
  postId: number;
}

export const SavePostDialog = (props: SavePostDialogProps) => {
  const { onClose, open, postId } = props;
  const [isCreatingNewCollection, setIsCreatingNewCollection] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const collections = [
    { name: "My Art Projects", postIds: [postId] },
    { name: "Inspiration Board", postIds: [] },
  ];

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClose = () => {
    onClose();
  };

  const handleCreateNewCollection = () => {
    setIsCreatingNewCollection(true);
  };

  const handleSaveCollection = () => {
    setIsCreatingNewCollection(false);
  };

  const descriptionElementRef = useRef<HTMLElement>(null);

  return (
    <Dialog
      open={open}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="scroll-dialog-title"
        className="flex justify-between items-center"
      >
        <span>
          {isCreatingNewCollection
            ? "Create New Collection"
            : "Add Project to Collection"}
        </span>
        <Button className="min-w-auto aspect-[1/1]" onClick={handleClose}>
          <X />
        </Button>
      </DialogTitle>
      <DialogContent
        dividers={true}
        className="flex flex-col gap-4 px-0 w-[600px]"
      >
        {isCreatingNewCollection ? (
          <div className="flex flex-col gap-1 px-4">
            <Input
              placeholder="Collection name"
              className="shadow-inner px-2 py-1 border-1 rounded w-full"
              disableUnderline
            />
            <FormControlLabel
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
              control={
                <Checkbox
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  color="primary"
                />
              }
              label="Private"
            />
            <div className="flex justify-between">
              <Button
                variant="contained"
                className="shadow-none mt-4 font-normal normal-case"
                onClick={handleSaveCollection}
              >
                Create
              </Button>
              <Button
                variant="outlined"
                className="shadow-none mt-4 font-normal normal-case"
                onClick={handleSaveCollection}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4">
              <Button
                variant="outlined"
                className="flex items-center gap-2 p-2"
                onClick={handleCreateNewCollection}
              >
                <PlusCircleIcon />
                <span className="font-normal text-md normal-case">
                  Create new collection
                </span>
              </Button>
            </div>
            <div className="px-4">
              <div className="relative flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl h-10 text-mountain-500 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-mountain-400">
                <FiSearch className="left-2 absolute w-5 h-5" />
                <Input
                  className="shadow-inner pr-8 pl-8 border-1 border-mountain-500 rounded-2xl w-full h-full"
                  placeholder="Search"
                  disableUnderline
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TiDeleteOutline
                  className="right-2 absolute w-5 h-5"
                  onClick={() => setSearchQuery("")}
                />
              </div>
            </div>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              {filteredCollections.map((collection, index) => (
                <div
                  className="flex items-center gap-2 p-2 px-4 border-mountain-400 border-b"
                  key={index}
                >
                  <img
                    src="https://cdnb.artstation.com/p/channels/covers/000/000/077/20200505141007/thumb/thumb.jpg?1588705807"
                    className="border rounded-lg w-18 object-center object-cover aspect-[1/1]"
                    alt="Thumbnail"
                  />
                  <div className="flex flex-col flex-grow gap-1">
                    <div className="font-bold">{collection.name}</div>
                    <div className="text-sm">
                      {collection.postIds.includes(postId)
                        ? "Contains this project"
                        : "No related project"}
                    </div>
                  </div>
                  {collection.postIds.includes(postId) ? (
                    <Button
                      variant="outlined"
                      className="flex items-center gap-1 shadow-none font-normal normal-case"
                      disableRipple
                    >
                      <CheckIcon size={16} />
                      <span>Added</span>
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className="shadow-none font-normal normal-case"
                    >
                      Add to collection
                    </Button>
                  )}
                </div>
              ))}
            </DialogContentText>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
