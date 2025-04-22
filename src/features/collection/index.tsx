import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Dialog,
  ToggleButton,
  Tooltip,
} from "@mui/material";

import { Collection, Post } from "@/types";
import {
  CollectionDisplayInfo,
  SelectedCollectionId,
  SliderItem,
  SliderItemCollection,
} from "./types/collection";
import { useCollectionsData } from "./hooks/useCollectionsData";
import { useGalleryPhotos } from "./hooks/useGalleryPhotos";
import {
  deleteCollection,
  removePostFromCollection,
  updateCollection,
} from "./api/collection.api";
import { CollectionSlider } from "./components/CollectionSlider";
import { CollectionTitle } from "./components/CollectionTitle";
import { CollectionGallery } from "./components/CollectionGallery";
import { CreateCollectionDialog } from "./components/CreateCollectionDialog";
import { SearchInput } from "@/components/SearchInput";
import { FiGlobe as AllIcon, FiLock as LockIcon } from "react-icons/fi";

const CollectionPage: React.FC = () => {
  const [selectedCollectionId, setSelectedCollectionId] =
    useState<SelectedCollectionId>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);
  const [showOnlyPrivate, setShowOnlyPrivate] = useState<boolean>(false);

  const {
    collections,
    loading: loadingCollections,
    error: collectionsError,
    setCollections,
    setError: setCollectionsError,
  } = useCollectionsData();

  const currentCollection = useMemo<Collection | undefined>(() => {
    return typeof selectedCollectionId === "number"
      ? collections.find((c) => c.id === selectedCollectionId)
      : undefined;
  }, [collections, selectedCollectionId]);

  const existingCollectionNames = useMemo(() => {
    return collections.map((col) => col.name);
  }, [collections]);

  const {
    publicPosts,
    privatePosts,
    newestPublicThumbnail,
    newestPrivateThumbnail,
  } = useMemo(() => {
    if (loadingCollections || !collections) {
      return {
        publicPosts: [],
        privatePosts: [],
        newestPublicThumbnail: undefined,
        newestPrivateThumbnail: undefined,
      };
    }

    // Calculate public posts and their newest thumbnail
    const pubCollections = collections.filter((c) => !c.is_private && c.posts);
    const pubPosts = pubCollections.flatMap((col) => col.posts);
    const uniquePublicMap = new Map<number, Post>();
    pubPosts.forEach((post) => {
      if (!uniquePublicMap.has(post.id)) {
        uniquePublicMap.set(post.id, post);
      }
    });
    const uniquePublicPosts = Array.from(uniquePublicMap.values()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const newestPublicPost = uniquePublicPosts[0];
    const pubThumbnail =
      newestPublicPost?.thumbnail_url || newestPublicPost?.medias?.[0]?.url;

    // Calculate private posts and their newest thumbnail
    const privCollections = collections.filter((c) => c.is_private && c.posts);
    const privPosts = privCollections.flatMap((col) => col.posts);
    const uniquePrivateMap = new Map<number, Post>();
    privPosts.forEach((post) => {
      if (!uniquePrivateMap.has(post.id)) {
        uniquePrivateMap.set(post.id, post);
      }
    });
    const uniquePrivatePosts = Array.from(uniquePrivateMap.values()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const newestPrivatePost = uniquePrivatePosts[0];
    const privThumbnail =
      newestPrivatePost?.thumbnail_url || newestPrivatePost?.medias?.[0]?.url;

    return {
      publicPosts: uniquePublicPosts,
      privatePosts: uniquePrivatePosts,
      newestPublicThumbnail: pubThumbnail,
      newestPrivateThumbnail: privThumbnail,
    };
  }, [
    collections,
    loadingCollections /* allPosts dependency removed if not used for unassigned */,
  ]);

  const filteredPosts = useMemo<Post[]>(() => {
    console.log(
      `FILTERED_POSTS: Recalculating. Selected ID: ${selectedCollectionId}, Show Only Private: ${showOnlyPrivate}`,
    );
    if (loadingCollections) return []; // Already handled in pre-calc, but keep for safety

    if (selectedCollectionId === "all") {
      return showOnlyPrivate ? privatePosts : publicPosts; // Use pre-calculated lists
    } else {
      // Logic for specific collection remains the same
      if (currentCollection) {
        const collectionMatchesFilter =
          !showOnlyPrivate || currentCollection.is_private;
        return collectionMatchesFilter ? currentCollection.posts || [] : [];
      }
      return [];
    }
    // Sorting is already done in pre-calculation
  }, [
    // Replace collections dependency with pre-calculated ones if possible
    // collections, // Keep if needed for currentCollection lookup
    publicPosts,
    privatePosts,
    currentCollection,
    selectedCollectionId,
    loadingCollections,
    showOnlyPrivate,
  ]);

  const {
    galleryPhotos,
    isProcessing: isProcessingPhotos,
    processingError: photosError,
  } = useGalleryPhotos(filteredPosts);

  const collectionsForDisplay = useMemo<CollectionDisplayInfo[]>(() => {
    if (loadingCollections) return [];
    return collections.map((collection) => {
      const sortedPosts = [...(collection.posts || [])].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const newestPostInCollection = sortedPosts[0];
      const thumbnailUrl =
        newestPostInCollection?.thumbnail_url ||
        newestPostInCollection?.medias?.[0]?.url;
      return { ...collection, thumbnailUrl, posts: collection.posts || [] };
    });
  }, [collections, loadingCollections]);

  const combinedSliderData = useMemo<SliderItem[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const items: SliderItem[] = [];

    // 1. "Add" button
    items.push({ type: "add" });

    // 2. "All Posts" item - Conditionally set thumbnail and count
    const allPostsTitle = "all posts";
    if (!normalizedQuery || allPostsTitle.includes(normalizedQuery)) {
      const countForAllPosts = showOnlyPrivate
        ? privatePosts.length
        : publicPosts.length;
      const thumbnailForAllPosts = showOnlyPrivate
        ? newestPrivateThumbnail
        : newestPublicThumbnail;

      items.push({
        type: "all",
        // Use the relevant thumbnail based on the filter, or undefined if no posts match
        thumbnailUrl: countForAllPosts > 0 ? thumbnailForAllPosts : undefined,
        // Show the count relevant to the current filter state
        count: countForAllPosts,
      });
    }

    // 3. Filter *actual* Collections
    const filteredCollectionItems: SliderItemCollection[] =
      collectionsForDisplay
        .filter((collection) => {
          const matchesVisibility = !showOnlyPrivate || collection.is_private;
          const matchesSearch =
            !normalizedQuery ||
            collection.name.toLowerCase().includes(normalizedQuery);
          return matchesVisibility && matchesSearch;
        })
        .map((collection) => ({
          type: "collection",
          id: collection.id,
          name: collection.name,
          // Thumbnail for specific collections can remain as calculated before
          thumbnailUrl: collection.thumbnailUrl,
          count: collection.posts?.length ?? 0, // Count remains total for the collection card
        }));

    items.push(...filteredCollectionItems);

    // Optional Sort
    const addIndex = items.findIndex((item) => item.type === "add");
    const allPostsIndex = items.findIndex((item) => item.type === "all");
    if (allPostsIndex > addIndex + 1) {
      const [allPostsItem] = items.splice(allPostsIndex, 1);
      items.splice(addIndex + 1, 0, allPostsItem);
    }

    return items;
  }, [
    collectionsForDisplay, // Keep for mapping actual collections
    // Remove newestOverallThumbnailUrl if replaced
    // allPosts.length, // Replaced by specific counts
    publicPosts.length, // Add new dependency
    privatePosts.length, // Add new dependency
    newestPublicThumbnail, // Add new dependency
    newestPrivateThumbnail, // Add new dependency
    searchQuery,
    showOnlyPrivate,
  ]);

  const handleTogglePrivateFilter = useCallback(() => {
    setShowOnlyPrivate((prev) => !prev);
    // Optional: Reset selection when filter changes?
    // if (!showOnlyPrivate) { // If switching *to* private only
    //    Maybe check if current selection is private, if not, select 'all' or first private?
    // } else { // If switching *from* private only to all
    //    Selection can probably stay as is.
    // }
  }, []);

  const handleCollectionSelect = useCallback(
    (id: SelectedCollectionId) => {
      setSelectedCollectionId(id);
      setActionError(null);
      setCollectionsError(null);
    },
    [setCollectionsError],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddCollectionClick = useCallback(() => {
    setIsCreateDialogOpen(true);
    setActionError(null);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const handleCreateCollection = useCallback(
    async (newCollection: Collection) => {
      setActionError(null);

      setCollections((prevCollections) => [...prevCollections, newCollection]);

      setSelectedCollectionId(newCollection.id);

      handleCloseCreateDialog();
    },
    [setCollections, handleCloseCreateDialog],
  );

  const handleEditRequest = useCallback(() => {
    setActionError(null);
    setIsTitleEditing(true);
  }, []);

  const handleEditCancel = useCallback(() => {
    setIsTitleEditing(false);
  }, []);

  const handleSaveTitle = useCallback(
    async (newName: string): Promise<void> => {
      if (!currentCollection) return;

      setActionError(null);

      try {
        const updatedCollectionFromApi = await updateCollection(
          currentCollection.id,
          { name: newName },
        );

        setCollections((prevCollections) =>
          prevCollections.map((col) =>
            col.id === updatedCollectionFromApi.id
              ? { ...col, name: updatedCollectionFromApi.name }
              : col,
          ),
        );

        setIsTitleEditing(false);
      } catch (err) {
        console.error("Error renaming collection via API:", err);
        const errorMsg =
          err instanceof Error ? err.message : "Failed to rename collection.";

        setActionError(errorMsg);

        throw err;
      }
    },
    [currentCollection, setCollections, setActionError],
  );

  const handleRemovePost = useCallback(
    async (postId: number) => {
      if (typeof selectedCollectionId !== "number") return;

      setActionError(null);
      const originalCollections = collections;

      setCollections((prevCollections) =>
        prevCollections.map((col) => {
          if (col.id === selectedCollectionId) {
            return {
              ...col,
              posts: (col.posts || []).filter((p) => p.id !== postId),
            };
          }
          return col;
        }),
      );

      try {
        await removePostFromCollection(selectedCollectionId, postId);
      } catch (err) {
        console.error(`Error removing post ${postId}:`, err);
        const errorMsg =
          err instanceof Error ? err.message : "Failed to remove post.";
        setActionError(errorMsg);
        setCollections(originalCollections);
        alert(`Error removing post: ${errorMsg}`);
      }
    },
    [selectedCollectionId, collections, setCollections],
  );

  const handleRemoveCollection = useCallback(
    (collectionIdToRemove: number) => {
      const collection = collections.find((c) => c.id === collectionIdToRemove);
      if (!collection) {
        console.warn(
          "Tried to initiate delete for non-existent collection:",
          collectionIdToRemove,
        );
        return;
      }

      setCollectionToDelete(collection);
      setIsDeleteDialogOpen(true);
      setActionError(null);
    },
    [collections],
  );

  const handleConfirmDeleteCollection = useCallback(async () => {
    if (!collectionToDelete) return;

    const collectionIdToRemove = collectionToDelete.id;
    const originalCollections = [...collections];

    handleCloseDeleteDialog();

    setCollections((prev) => prev.filter((c) => c.id !== collectionIdToRemove));

    if (selectedCollectionId === collectionIdToRemove) {
      setSelectedCollectionId("all");
    }

    try {
      await deleteCollection(collectionIdToRemove);

      console.log(`Collection ${collectionIdToRemove} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting collection:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete collection.";
      setActionError(errorMsg);

      setCollections(originalCollections);

      if (
        selectedCollectionId === "all" &&
        originalCollections.some((c) => c.id === collectionIdToRemove)
      ) {
        setSelectedCollectionId(collectionIdToRemove);
      }
    }
  }, [
    collectionToDelete,
    collections,
    setCollections,
    selectedCollectionId,
    setActionError,
  ]);

  const galleryTitle = useMemo(() => {
    // Handle initial loading state first
    if (
      loadingCollections &&
      selectedCollectionId !== "all" &&
      !currentCollection
    ) {
      return "Loading...";
    }

    // Handle "All Posts" selection
    if (selectedCollectionId === "all") {
      // Title should reflect the filter state when 'All' is selected
      return "All"; // Or adjust wording
    }

    // Handle specific collection selection (selectedCollectionId is a number)
    if (currentCollection) {
      // Check if the selected collection matches the *current* filter state
      const collectionMatchesFilter =
        !showOnlyPrivate || currentCollection.is_private;

      if (collectionMatchesFilter) {
        // If it matches, show its actual name
        return currentCollection.name;
      } else {
        // If it *doesn't* match (e.g., public item selected, then filter toggled to private),
        // the gallery is empty. The title should reflect the active filter state.
        // It shouldn't show the name of the now-hidden collection.
        return "All"; // Or simply "Private Collections"
      }
    }

    // Fallback: Should ideally not be reached if selectedId is 'all' or a valid number w/ data
    // If reached, could mean data inconsistency or selection is briefly invalid.
    // Defaulting to the filter state might be safest.
    console.warn(
      "GalleryTitle: Fallback reached, currentCollection likely undefined for selected ID",
      selectedCollectionId,
    );
    return showOnlyPrivate ? "Private Collections" : "All Collections"; // Fallback title
  }, [
    selectedCollectionId,
    currentCollection, // Depends on the selected item object
    loadingCollections,
    showOnlyPrivate, // <<< Now depends on the filter state
    // collections might be needed if calculating counts or checking emptiness below
  ]);

  const galleryItemCountText = useMemo(() => {
    if (loadingCollections) return "Loading...";
    if (isProcessingPhotos) return "Processing...";
    return `${galleryPhotos.length} items`;
  }, [loadingCollections, isProcessingPhotos, galleryPhotos.length]);

  const isGalleryLoading = loadingCollections || isProcessingPhotos;
  const displayError = collectionsError || photosError || actionError;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 2, md: 3 }}
        mb={4}
        flexWrap="wrap"
      >
        {/* Left Side: Title */}
        <Typography variant="h6" component="h1" fontWeight="normal" noWrap>
          Collections
        </Typography>

        {/* Right Side: Filter & Search */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Filter Toggle Button */}
          <Tooltip
            title={
              showOnlyPrivate
                ? "Show All Collections"
                : "Show Only Private Collections"
            }
          >
            <ToggleButton
              value="privateFilter" // Value is static, selection state matters
              selected={showOnlyPrivate} // Control selection based on state
              onChange={handleTogglePrivateFilter} // Toggle state on change
              aria-label="Toggle private collection filter"
              size="small"
              sx={{
                height: "fit-content",
                textTransform: "none",
                display: "inline-flex", // Use inline-flex or flex
                alignItems: "center", // Vertical alignment
                justifyContent: "center",
                bgcolor: "background.paper",
              }} // Ensure vertical alignment
            >
              {/* Show Lock icon when filtering, LockOpen/Apps when not */}
              {!showOnlyPrivate ? (
                <LockIcon fontSize={16} />
              ) : (
                <AllIcon fontSize={16} />
              )}
              {/* Optionally add text - might make button too wide */}
              <Typography
                variant="caption"
                sx={{
                  // No margin needed here if added to icon
                  ml: 1,
                  display: { xs: "none", sm: "inline" }, // Use 'inline' for better flow with icon
                  lineHeight: 1, // Adjust line height for captions if needed
                }}
              >
                {/* Text also depends on the current state */}
                {showOnlyPrivate ? "All" : "Private Only"}
              </Typography>
            </ToggleButton>
          </Tooltip>

          {/* Search Input */}
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Search collections..."
          />
        </Stack>
      </Stack>

      {/* Slider */}
      <Box mb={6}>
        <CollectionSlider
          items={combinedSliderData}
          selectedId={selectedCollectionId}
          loading={loadingCollections}
          onSelect={handleCollectionSelect}
          onAdd={handleAddCollectionClick}
          onRemove={handleRemoveCollection}
        />
      </Box>

      {/* Title Section */}
      <Box mb={4}>
        <CollectionTitle
          title={galleryTitle} // Pass the updated title
          itemCountText={galleryItemCountText}
          isEditable={
            typeof selectedCollectionId === "number" &&
            (!showOnlyPrivate || !!currentCollection?.is_private)
          } // Only allow editing if the selected collection matches the filter
          // ... other props ...
          isLoading={
            loadingCollections &&
            !currentCollection &&
            selectedCollectionId !== "all"
          }
          error={actionError}
          onSave={handleSaveTitle}
          isEditing={isTitleEditing}
          onEditRequest={handleEditRequest}
          onEditCancel={handleEditCancel}
          existingCollectionNames={existingCollectionNames}
        />
        {/* Display data loading or photo processing errors below the title component */}
        {(collectionsError || photosError) && !actionError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            Error: {collectionsError || photosError}
          </Typography>
        )}
      </Box>

      {/* Gallery */}
      <CollectionGallery
        photos={galleryPhotos}
        isLoading={isGalleryLoading}
        isError={!!displayError && !isGalleryLoading}
        error={displayError && !isGalleryLoading ? displayError : null}
        onRemovePost={handleRemovePost}
        selectedCollectionId={selectedCollectionId}
      />

      {/* Fallback loading indicator if gallery is empty during load */}
      {isGalleryLoading && galleryPhotos.length === 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: 200 }}
        >
          <CircularProgress />
        </Box>
      )}
      <CreateCollectionDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateCollection}
        existingCollectionNames={collections.map((c) => c.name)}
      />

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-collection-dialog-title"
        aria-describedby="delete-collection-dialog-description"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogTitle id="delete-collection-dialog-title">
          Confirm Delete Collection
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-collection-dialog-description">
            Are you sure you want to delete the collection{" "}
            <strong>"{collectionToDelete?.name || "this collection"}"</strong>?
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {" "}
          {/* Added padding */}
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          {/* Call the confirmation handler */}
          <Button
            onClick={handleConfirmDeleteCollection}
            variant="contained"
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollectionPage;
