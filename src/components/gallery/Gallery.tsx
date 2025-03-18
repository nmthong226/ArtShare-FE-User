import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { fetchPosts } from "./api/unsplashService";
import LoadingSpinner from "@/components/LoadingSpinner";
import Gallery, { PhotoProps, RenderImageProps } from "react-photo-gallery";
import ImageRenderer from "./ImageRenderer";
import { Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";

export interface GalleryPhoto extends PhotoProps {
  title: string;
  author: string;
  postLength: number;
}

const getMediaDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
};

const IGallery: React.FC = () => {
  const [filter, setFilter] = useState<string>("for-you");

  const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter) {
      setFilter(newFilter);
    }
  };

  const { data, error, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<GalleryPhoto[], Error>(
    "posts",
    async ({ pageParam = 1 }) => {
      const response = await fetchPosts(filter, pageParam);

      const galleryPhotos: GalleryPhoto[] = await Promise.all(
        response.data.map(async (post) => {
          const mediaDimensions = await getMediaDimensions(post.medias[0].url);
          return {
            key: post.medias[0].url,
            title: post.title || "Untitled",
            author: post.user.fullName,
            src: post.medias[0].url,
            width: mediaDimensions.width,
            height: mediaDimensions.height,
            postLength: post.medias.length,
          };
        })
      );

      return galleryPhotos;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length > 0) {
          return pages.length + 1;
        }
        return undefined;
      },
    }
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      const scrolledFromTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.offsetHeight;

      if (windowHeight + scrolledFromTop >= fullHeight - scrollThreshold) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    const checkContentHeight = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.offsetHeight;

      if (fullHeight < windowHeight) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    const handleResize = () => {
      checkContentHeight();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    checkContentHeight();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const galleryPhotos = data ? data.pages.flat() : [];

  const uniqueGalleryPhotos = Array.from(new Map(galleryPhotos.map((photo) => [photo.key, photo])).values());

  return (
    <div className="-mx-0.5">
      <Gallery photos={uniqueGalleryPhotos} renderImage={ImageRenderer as React.ComponentType<RenderImageProps>} />
      <Paper className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg z-50">
        <ToggleButtonGroup className="m-1.5 flex gap-2" size="small" value={filter} exclusive onChange={handleFilterChange}>
          <ToggleButton className="-m-0.5 border-0 py-2 px-4 rounded-full" value="for-you">
            For you
          </ToggleButton>
          <ToggleButton className="-m-0.5 border-0 py-2 px-4 rounded-full" value="following">
            Following
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {(isLoading || isFetchingNextPage) && (
        <div className="text-center m-4">
          <LoadingSpinner />
        </div>
      )}
      {isError && <div className="text-center text-red-500">{(error as Error).message}</div>}
    </div>
  );
};

export default IGallery;
