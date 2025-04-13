import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  CardActionArea,
  Paper,
} from "@mui/material";

import { Collection as CollectionType, Post } from "@/types";

import { fetchCollectionsWithPosts, fetchOrphanPosts } from "./mockApi";
import IGallery, { GalleryPhoto } from "@/components/gallery/Gallery";
import { getMediaDimensions } from "@/utils/helpers/gallery.helper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { HorizontalSlider } from "@/components/HorizontalSlider";

type SelectedCollectionId = number | "all";

interface CollectionDisplayInfo extends CollectionType {
  thumbnailUrl?: string;
}

type SliderItemAll = {
  type: "all";
  thumbnailUrl: string;
  count: number;
};
type SliderItemCollection = {
  type: "collection";
  id: number;
  name: string;
  thumbnailUrl: string;
  count: number;
};
type SliderItemAdd = {
  type: "add";
};
type SliderItem = SliderItemAll | SliderItemCollection | SliderItemAdd;

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/150/EEEEEE/AAAAAA?text=No+Image";

const Collection: React.FC = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const [orphanPosts, setOrphanPosts] = useState<Post[]>([]);

  const [selectedCollectionId, setSelectedCollectionId] =
    useState<SelectedCollectionId>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [fetchedCollections, fetchedOrphans] = await Promise.all([
          fetchCollectionsWithPosts(),
          fetchOrphanPosts(),
        ]);

        setCollections(fetchedCollections);
        setOrphanPosts(fetchedOrphans);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const allPosts = useMemo<Post[]>(() => {
    if (loading) return [];

    const combined = collections.reduce((acc, collection) => {
      acc.push(...collection.posts);
      return acc;
    }, [] as Post[]);
    combined.push(...orphanPosts);

    const uniquePosts = Array.from(
      new Map(combined.map((post) => [post.id, post])).values(),
    );

    return uniquePosts.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [collections, orphanPosts, loading]);

  const collectionsForDisplay = useMemo<CollectionDisplayInfo[]>(() => {
    if (loading) {
      return [];
    }

    return collections.map((collection) => {
      const newestPostInCollection = collection.posts[0];
      const thumbnailUrl =
        newestPostInCollection?.thumbnail_url ||
        newestPostInCollection?.medias?.[0]?.url;

      return {
        ...collection,
        thumbnailUrl: thumbnailUrl,
      };
    });
  }, [collections, loading]);

  const newestOverallThumbnailUrl = useMemo(() => {
    const newestPost = allPosts[0];
    return newestPost?.thumbnail_url || newestPost?.medias?.[0]?.url;
  }, [allPosts]);

  const filteredPosts = useMemo<Post[]>(() => {
    if (loading) return [];

    if (selectedCollectionId === "all") {
      return allPosts;
    }

    const selectedCollection = collections.find(
      (c) => c.id === selectedCollectionId,
    );

    return selectedCollection?.posts || [];
  }, [allPosts, collections, selectedCollectionId, loading]);

  useEffect(() => {
    if (loading) {
      setGalleryPhotos([]);
      return;
    }

    const transformPosts = async () => {
      if (filteredPosts.length === 0) {
        setGalleryPhotos([]);
        setIsProcessingPhotos(false);
        return;
      }

      console.log(`Transforming ${filteredPosts.length} posts for IGallery...`);
      setIsProcessingPhotos(true);

      try {
        const photosPromises = filteredPosts
          .filter(
            (post) =>
              post.thumbnail_url || (post.medias && post.medias.length > 0),
          )
          .map(async (post): Promise<GalleryPhoto | null> => {
            const imageUrl = post.thumbnail_url || post.medias?.[0]?.url;
            if (!imageUrl) return null;

            try {
              const dimensions = await getMediaDimensions(imageUrl);
              return {
                key: `post-${post.id}`,
                src: imageUrl,
                width: dimensions.width,
                height: dimensions.height,
                title: post.title || "Untitled Post",
                author: post.user?.username || "Unknown",
                postId: post.id,
                postLength: post.medias?.length ?? 0,
              };
            } catch (dimensionError) {
              console.error(
                `Error getting dimensions for post ${post.id}:`,
                dimensionError,
              );
              return null;
            }
          });

        const resolvedPhotos = await Promise.all(photosPromises);
        const validPhotos = resolvedPhotos.filter(
          (photo) => photo !== null,
        ) as GalleryPhoto[];
        console.log(
          `Transformation complete. ${validPhotos.length} valid photos.`,
        );
        setGalleryPhotos(validPhotos);
      } catch (error) {
        console.error("Error during post transformation:", error);
        setError("Failed to process post images.");
        setGalleryPhotos([]);
      } finally {
        setIsProcessingPhotos(false);
      }
    };

    transformPosts();
  }, [filteredPosts, loading]);

  const handleCollectionSelect = (id: SelectedCollectionId) => {
    setSelectedCollectionId(id);
  };

  const handleAddCollectionClick = () => {
    console.log("Add Collection button clicked");
    alert("Navigate to Add Collection page/modal (Not Implemented)");
  };

  const combinedSliderData = useMemo<SliderItem[]>(() => {
    if (loading && collectionsForDisplay.length === 0) {
      return [];
    }

    const allPostsItem: SliderItemAll = {
      type: "all",
      thumbnailUrl: newestOverallThumbnailUrl,
      count: allPosts.length,
    };

    const collectionItems: SliderItemCollection[] = collectionsForDisplay.map(
      (collection) => ({
        type: "collection",
        id: collection.id,
        name: collection.name,
        thumbnailUrl: collection.thumbnailUrl || PLACEHOLDER_IMAGE,
        count: collection.posts?.length ?? 0,
      }),
    );

    const addItem: SliderItemAdd = {
      type: "add",
    };

    return [allPostsItem, ...collectionItems, addItem];
  }, [
    loading,
    collectionsForDisplay,
    newestOverallThumbnailUrl,
    allPosts.length,
  ]);

  const renderCollectionList = () => {
    const cardMinWidth = 160;
    const cardHeight = 220;

    if (loading && combinedSliderData.length === 0) {
      return (
        <Box display="flex" gap={2} py={1} overflow="hidden">
          {[...Array(5)].map((_, index) => (
            <Paper
              key={`placeholder-${index}`}
              variant="outlined"
              sx={{
                minWidth: cardMinWidth,
                height: cardHeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                borderColor: "grey.300",
                borderStyle: "dashed",
                color: "grey.500",
                flexShrink: 0,
              }}
            >
              <CircularProgress size={24} color="inherit" />
            </Paper>
          ))}
        </Box>
      );
    }

    const getSliderItemId = (item: SliderItem): string => {
      switch (item.type) {
        case "all":
          return "all-posts";
        case "collection":
          return `collection-${item.id}`;
        case "add":
          return "add-collection";
        default:
          return `unknown-${Math.random()}`;
      }
    };

    const renderSliderItem = (item: SliderItem) => {
      // --- BASE STYLES FOR ALL CARDS ---
      // Moved common styles here, including the crucial fixes
      const baseCardSx = {
        // --- FIXES START ---
        width: cardMinWidth, // Explicitly set the width
        minWidth: cardMinWidth, // Keep minWidth as backup (optional)
        flexShrink: 0, // *** CRITICAL: Prevent item from shrinking ***
        // --- FIXES END ---

        height: cardHeight,
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s, border-color 0.3s",
        overflow: "hidden", // Prevent internal content overflow issues
        "&:hover": { boxShadow: 3 },
      };

      // --- RENDER BASED ON TYPE ---
      switch (item.type) {
        case "all": {
          const isSelected = selectedCollectionId === "all";
          return (
            <Card
              variant="outlined"
              sx={{
                // Apply base styles and specific border
                ...baseCardSx,
                borderColor: isSelected ? "primary.main" : "grey.300",
                borderWidth: isSelected ? 2 : 1,
              }}
            >
              {/* CardActionArea and content remain the same */}
              <CardActionArea
                onClick={() => handleCollectionSelect("all")}
                disabled={loading}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <CardMedia
                  component="img"
                  image={item.thumbnailUrl}
                  sx={{
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    width: "100%",
                    bgcolor: "grey.200",
                  }}
                />
                <CardContent sx={{ flexGrow: 1, width: "100%", p: 1.5 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    noWrap
                    fontWeight="medium"
                  >
                    All Posts
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {loading ? "..." : `${item.count} items`}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        }
        case "collection": {
          const isSelected = selectedCollectionId === item.id;
          return (
            <Card
              variant="outlined"
              sx={{
                // Apply base styles and specific border
                ...baseCardSx,
                borderColor: isSelected ? "primary.main" : "grey.300",
                borderWidth: isSelected ? 2 : 1,
              }}
            >
              {/* CardActionArea and content remain the same */}
              <CardActionArea
                onClick={() => handleCollectionSelect(item.id)}
                disabled={loading}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <CardMedia
                  component="img"
                  image={item.thumbnailUrl}
                  sx={{
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    width: "100%",
                    bgcolor: "grey.200",
                  }}
                />
                <CardContent sx={{ flexGrow: 1, width: "100%", p: 1.5 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    noWrap
                    fontWeight="medium"
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {loading ? "..." : `${item.count} items`}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        }
        case "add": {
          return (
            <Paper
              variant="outlined"
              onClick={handleAddCollectionClick}
              sx={{
                // Apply base styles and specific add card styles
                ...baseCardSx,
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                borderColor: "grey.400",
                borderStyle: "dashed",
                color: "grey.600",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              {/* Add Icon and text remain the same */}
              <AddCircleOutlineIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography
                variant="button"
                align="center"
                sx={{ lineHeight: 1.3 }}
              >
                Add New Collection
              </Typography>
            </Paper>
          );
        }
        default:
          return null;
      }
    };

    return (
      <HorizontalSlider
        data={combinedSliderData}
        renderItem={renderSliderItem}
        getItemId={getSliderItemId}
        wrapperClassName="collection-slider"
      />
    );
  };

  const renderGallery = () => {
    const showLoading = loading || isProcessingPhotos;

    const hasError = !!error;

    return (
      <IGallery
        photos={galleryPhotos}
        isLoading={showLoading && galleryPhotos.length === 0}
        isFetchingNextPage={false}
        isError={hasError}
        error={error ? new Error(error) : null}
      />
    );
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className="mb-6 font-semibold"
      >
        My Collections
      </Typography>

      <Box mb={6}>{renderCollectionList()}</Box>

      <Typography variant="h5" component="h2" className="mb-4 font-medium">
        {selectedCollectionId === "all"
          ? "All Posts"
          : `${collections.find((c) => c.id === selectedCollectionId)?.name || "Selected Collection"} Posts`}
        <span className="text-base font-normal text-gray-500 ml-2">
          ({loading ? "Loading..." : `${filteredPosts.length} items`})
        </span>
      </Typography>

      <Box>{renderGallery()}</Box>
    </Container>
  );
};

export default Collection;
