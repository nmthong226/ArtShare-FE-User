import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Button, DialogContent, DialogContentText, Input, FormControlLabel, Checkbox } from "@mui/material";
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

  const filteredCollections = collections.filter((collection) => collection.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
    <Dialog open={open} scroll="paper" aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" className="flex items-center justify-between">
        <span>{isCreatingNewCollection ? "Create New Collection" : "Add Project to Collection"}</span>
        <Button className="aspect-[1/1] min-w-auto" onClick={handleClose}>
          <X />
        </Button>
      </DialogTitle>
      <DialogContent dividers={true} className="flex flex-col gap-4 w-[600px] px-0">
        {isCreatingNewCollection ? (
          <div className="px-4 flex flex-col gap-1">
            <Input placeholder="Collection name" className="shadow-inner border-1 rounded w-full py-1 px-2" disableUnderline />
            <FormControlLabel
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
              control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} color="primary" />}
              label="Private"
            />
            <div className="flex justify-between">
              <Button variant="contained" className="mt-4 normal-case shadow-none font-normal" onClick={handleSaveCollection}>
                Create
              </Button>
              <Button variant="outlined" className="mt-4 normal-case shadow-none font-normal" onClick={handleSaveCollection}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4">
              <Button variant="outlined" className="flex gap-2 items-center p-2" onClick={handleCreateNewCollection}>
                <PlusCircleIcon />
                <span className="normal-case font-normal text-md">Create new collection</span>
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
                <TiDeleteOutline className="right-2 absolute w-5 h-5" onClick={() => setSearchQuery("")} />
              </div>
            </div>
            <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
              {filteredCollections.map((collection, index) => (
                <div className="flex gap-2 items-center p-2 border-b border-mountain-400" key={index}>
                  <img
                    src="https://cdnb.artstation.com/p/channels/covers/000/000/077/20200505141007/thumb/thumb.jpg?1588705807"
                    className="object-cover object-center w-18 aspect-[1/1] rounded-lg border"
                    alt="Thumbnail"
                  />
                  <div className="flex flex-col gap-1 flex-grow">
                    <div className="font-bold">{collection.name}</div>
                    <div className="text-sm">{collection.postIds.includes(postId) ? "Contains this project" : "No related project"}</div>
                  </div>
                  {collection.postIds.includes(postId) ? (
                    <Button variant="outlined" className="normal-case shadow-none font-normal flex gap-1 items-center" disableRipple>
                      <CheckIcon size={16} />
                      <span>Added</span>
                    </Button>
                  ) : (
                    <Button variant="contained" className="normal-case shadow-none font-normal">
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
