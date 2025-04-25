import { Backdrop, Button, CardContent, CircularProgress, Divider, Menu, MenuItem, Typography } from "@mui/material";
import {
  MessageSquareText,
  Bookmark,
  EllipsisVertical,
  Share2,
} from "lucide-react";
import ShowMoreText from "react-show-more-text";
import { ElementType, useState, useEffect, useCallback } from "react";
import ReactTimeAgo from "react-time-ago";
import { Post, Collection } from "@/types";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import { SavePostDialog } from "./SavePostDialog";
import { CreateCollectionDialog } from "@/features/collection/components/CreateCollectionDialog";
import { fetchCollectionsForDialog } from "../api/collection.api";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { deletePost } from "@/api/post/post";
import { useSnackbar } from "@/contexts/SnackbarProvider";

interface SimpleCollection {
  id: number;
  name: string;
}

const AnyShowMoreText: ElementType = ShowMoreText as unknown as ElementType;

const PostInfo = ({ postData }: { postData: Post }) => {
  const { postCommentsRef } = useFocusContext();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [simpleCollections, setSimpleCollections] = useState<
    SimpleCollection[]
  >([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const [userLike, setUserLike] = useState(false);
  const [likeCount, setLikeCount] = useState(postData.like_count);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // State for the ellipsis menu popover
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  // Get current Firebase user

  const currentUser = auth.currentUser;

  // Compare postData.user_id to currentUser.uid to determine ownership.

  const isOwner = currentUser && postData.user_id === currentUser.uid;

  useEffect(() => {
    const loadCollectionNames = async () => {
      setIsLoadingCollections(true);
      setCollectionError(null);
      try {
        console.log("Fetching simple collections for CreateDialog check...");
        const fetchedCollections = await fetchCollectionsForDialog();
        setSimpleCollections(fetchedCollections);
        console.log("Simple collections fetched:", fetchedCollections);
      } catch (error) {
        console.error("Failed to fetch simple collections:", error);
        setCollectionError(
          error instanceof Error
            ? error.message
            : "Could not load collection list.",
        );
      } finally {
        setIsLoadingCollections(false);
      }
    };

    loadCollectionNames();
  }, [postData.id]);

  const handleOpenSaveDialog = () => {
    setIsCreateDialogOpen(false);
    setIsSaveDialogOpen(true);
  };

  const handleCloseSaveDialog = () => {
    setIsSaveDialogOpen(false);
  };

  const handleNavigateToCreate = () => {
    if (isLoadingCollections || collectionError) {
      console.warn(
        "Cannot navigate to create collection: Still loading or error fetching collection names.",
      );

      return;
    }
    setIsSaveDialogOpen(false);
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCollectionCreated = useCallback(
    (newCollection: Collection) => {
      console.log("PostInfo received new collection:", newCollection);
      const newSimpleCollection: SimpleCollection = {
        id: newCollection.id,
        name: newCollection.name,
      };
      setSimpleCollections((prev) => [...prev, newSimpleCollection]);

      if (collectionError) setCollectionError(null);
      setIsCreateDialogOpen(false);
      setIsSaveDialogOpen(true);
    },
    [collectionError],
  );

  const handleFocusCommentInput = () => {
    if (postCommentsRef.current) {
      postCommentsRef.current.focusInput();
    }
  };

  const handleLikeClick = () => {
    if (userLike) {
      if (likeCount > 0) {
        setLikeCount(likeCount - 1);
      }
    } else {
      setLikeCount(likeCount + 1);
    }
    setUserLike(!userLike);
  };

  // Handlers for the ellipsis menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleReport = () => {
    // Insert your report logic here.
    console.log("Report clicked");
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(`/post/${postData.id}/edit`, {
      state: { postData },
    });
  };

  const handleDelete = () => {
    // Insert your delete logic here.
    setIsDeleting(true)
    deletePost(postData.id)
    .then(() => {
      navigate(`/${postData.user.username}`)
    })
    .catch(() => {
      showSnackbar("Failed to update post", "error");
    })
    .finally(() => {
      setIsDeleting(false)
    });
    console.log("Delete clicked");
    handleMenuClose();
  };

  if (!postData) return null;

  const existingCollectionNames = simpleCollections.map((c) => c.name);

  const disableCreate = isLoadingCollections || !!collectionError;
  const createTooltip = isLoadingCollections
    ? "Loading collection list..."
    : collectionError
      ? `Cannot create: ${collectionError}`
      : "";

  return (
    <>
      <div className="bg-white shadow p-4 rounded-2xl md:rounded-t-none overflow-none">
        {isDeleting && (
          <Backdrop
            open
            sx={{ color: "#fff", zIndex: (t) => t.zIndex.modal + 1 }}
          >
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }}>Deleting post…</Typography>
          </Backdrop>
        )}
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">{postData.title}</div>
            <AnyShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              className="text-sm break-words"
              anchorClass="cursor-pointer hover:text-cyan-500 block py-2 underline text-sm"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {postData.description}
            </AnyShowMoreText>
            <div className="text-xs italic">
              Posted <ReactTimeAgo date={new Date(postData.created_at)} />
            </div>
          </div>
          <Divider className="border-0.5" />
          <div className="flex gap-6 text-mountain-950">
            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{likeCount}</p>
              <span className="text-mountain-600">
                {likeCount > 1 ? " Likes" : " Like"}
              </span>
            </div>
              <div className="flex items-center gap-1 text-sm">
                <p className="font-semibold">{postData.comment_count}</p>
                <span className="text-mountain-600">
                  {postData.comment_count > 1 ? " Comments" : " Comment"}
                </span>
              </div>
            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{"1k"}</p>{" "}
                <span className="text-mountain-600">Views</span>
            </div>
          </div>
          <Divider className="border-0.5" />
          <div className="flex justify-between w-full">
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Like"
              onClick={handleLikeClick}
            >
              {" "}
              {userLike ? (
                <AiFillLike className="size-6" />
              ) : (
                <AiOutlineLike className="size-6" />
              )}{" "}
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Comment"
              onClick={handleFocusCommentInput}
            >
              {" "}
              <MessageSquareText />{" "}
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Save"
              onClick={handleOpenSaveDialog}
            >
              {" "}
              <Bookmark />{" "}
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Copy Link"
            >
              {" "}
              <Share2 />{" "}
            </Button>
            <Button
              className="border-0 min-w-auto aspect-[1/1] text-blue-900"
              onClick={handleMenuOpen}
            >
              <EllipsisVertical />
            </Button>
          </div>
        </CardContent>
        {/* Save Post Dialog */}
        <SavePostDialog
          postId={postData.id}
        open={isSaveDialogOpen}
          onClose={handleCloseSaveDialog}
        onNavigateToCreate={handleNavigateToCreate}
        createDisabled={disableCreate}
        createDisabledReason={createTooltip}
      />

      {/* CreateCollectionDialog */}
      <CreateCollectionDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCollectionCreated}
        existingCollectionNames={existingCollectionNames}
      />
      <Menu
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {isOwner ? (
            <>
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleReport}>Report</MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
};

export default PostInfo;
