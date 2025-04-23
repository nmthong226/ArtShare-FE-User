import { Button, CardContent, Divider } from "@mui/material";
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

import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { fetchCollectionsForDialog } from "../api/collection.api";
import { LikesDialog } from "@/components/like/LikesDialog";

interface SimpleCollection {
  id: number;
  name: string;
}

const AnyShowMoreText: ElementType = ShowMoreText as unknown as ElementType;

const PostInfo = ({ postData }: { postData: Post }) => {
  const { postCommentsRef } = useFocusContext();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLikesDialogOpen, setIsLikesDialogOpen] = useState(false);
  const [simpleCollections, setSimpleCollections] = useState<
    SimpleCollection[]
  >([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  const [userLike, setUserLike] = useState(false);
  const [likeCount, setLikeCount] = useState(postData.like_count);

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
  const handleCloseSaveDialog = () => setIsSaveDialogOpen(false);

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
  const handleCloseCreateDialog = () => setIsCreateDialogOpen(false);

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

  const handleOpenLikesDialog = () => {
    if (likeCount > 0) {
      setIsLikesDialogOpen(true);
    }
  };

  const handleCloseLikesDialog = () => {
    setIsLikesDialogOpen(false);
  };

  const handleFocusCommentInput = () => {
    postCommentsRef.current?.focusInput();
  };

  const handleLikeClick = () => {
    const didLike = !userLike;
    setUserLike(didLike);
    setLikeCount((prevCount) =>
      didLike ? prevCount + 1 : Math.max(0, prevCount - 1),
    );
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
        <CardContent className="flex flex-col gap-4 p-0">
          {/* Post Title, Description, TimeAgo */}
          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">{postData.title}</div>
            {/* Assuming ShowMoreText has correct props passed */}
            <AnyShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              anchorClass="text-blue-600 hover:underline cursor-pointer text-sm"
            >
              {postData.description || ""}
            </AnyShowMoreText>
            <div className="text-xs italic text-gray-500">
              Posted{" "}
              <ReactTimeAgo
                date={new Date(postData.created_at)}
                locale="en-US"
              />
            </div>
          </div>
          <Divider className="border-0.5" />
          {/* Post Stats */}
          <div className="flex gap-6 text-mountain-950">
            {/* --- MODIFIED LIKES DIV --- */}
            <div
              className={`flex items-center gap-1 text-sm ${likeCount > 0 ? "cursor-pointer hover:underline" : "cursor-default"}`}
              onClick={handleOpenLikesDialog}
              title={likeCount > 0 ? "View who liked this" : "No likes yet"}
            >
              <p className="font-semibold">{likeCount}</p>
              <span className="text-mountain-600">
                {likeCount !== 1 ? " Likes" : " Like"}
              </span>
            </div>
            {/* --- END MODIFIED LIKES DIV --- */}

            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{postData.comment_count}</p>
              <span className="text-mountain-600">
                {postData.comment_count !== 1 ? " Comments" : " Comment"}
              </span>
            </div>
            {/* Add View Count - You'll need to fetch this data */}
            {/* <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{postData.view_count || 0}</p>
              <span className="text-mountain-600">Views</span>
            </div> */}
          </div>
          <Divider className="border-0.5" />
          {/* Action Buttons */}
          <div className="flex justify-between w-full">
            <Button
              className="p-2 border-0 min-w-0 text-blue-900 hover:bg-blue-50 rounded-lg w-10 h-10"
              title="Like"
              onClick={handleLikeClick}
            >
              {userLike ? (
                <AiFillLike className="size-6 text-blue-900" />
              ) : (
                <AiOutlineLike className="size-6" />
              )}
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900 hover:bg-blue-50 rounded-lg w-10 h-10"
              title="Comment"
              onClick={handleFocusCommentInput}
            >
              <MessageSquareText className="size-5" />
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900 hover:bg-blue-50 rounded-lg w-10 h-10"
              title="Save"
              onClick={handleOpenSaveDialog}
            >
              <Bookmark className="size-5" />
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900 hover:bg-blue-50 rounded-lg w-10 h-10"
              title="Copy Link"
            >
              <Share2 className="size-5" />
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900 hover:bg-blue-50 rounded-lg w-10 h-10"
              title="More options"
            >
              <EllipsisVertical className="size-5" />
            </Button>
          </div>
        </CardContent>
      </div>

      {/* SavePostDialog */}
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

      {/* --- Render Likes Dialog --- */}
      <LikesDialog
        postId={postData.id}
        open={isLikesDialogOpen}
        onClose={handleCloseLikesDialog}
      />
      {/* --- End Render Likes Dialog --- */}
    </>
  );
};

export default PostInfo;
