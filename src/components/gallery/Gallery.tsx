import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "./api/post";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Photo, RowsPhotoAlbum } from "react-photo-album";
import { ImageRenderer } from "./ImageRenderer";
import { Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import "react-photo-album/rows.css";
export interface GalleryPhoto extends Photo {
  title: string;
  author: string;
  postLength: number;
  postId: number;
}

const getMediaDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
};

const IGallery = ({ query, filter }: { query: string; filter: string[] }) => {
  const [tab, setTab] = useState<string>("for-you");

  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    if (newFilter) {
      setTab(newFilter);
    }
  };

  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", tab, query, filter],
    queryFn: async ({ pageParam = 1 }) => {
      const posts = await fetchPosts(pageParam, tab, query, filter);
      const galleryPhotos = await Promise.all(
        posts.map(async (post) => {
          if (!post.thumbnail_url && post.medias.length === 0) {
            return null;
          }
          const mediaDimensions = await getMediaDimensions(post.thumbnail_url || post.medias[0].url);
          return {
            key: post.id.toString(),
            title: post.title || "",
            author: post.user.fullName,
            src: post.thumbnail_url,
            width: mediaDimensions.width,
            height: mediaDimensions.height,
            postLength: post.medias.length,
            postId: post.id,
          };
        })
      );
      return galleryPhotos;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length > 0 ? pages.length + 1 : undefined,
  });

  useEffect(() => {
    const debounce = <T extends unknown[]>(
      func: (...args: T) => void,
      delay: number
    ): ((...args: T) => void) => {
      let timeoutId: number | null = null;

      return (...args: T) => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => func(...args), delay);
      };
    };

    const handleScroll = debounce(() => {
      const scrollThreshold = 100;
      const galleryArea = document.querySelector(".gallery-area");

      if (galleryArea instanceof HTMLElement) {
        const scrolledFromTop = galleryArea.scrollTop;
        const galleryHeight = galleryArea.offsetHeight;
        const scrollableHeight = galleryArea.scrollHeight;

        if (
          galleryHeight + scrolledFromTop >=
          scrollableHeight - scrollThreshold
        ) {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }
      } else {
        console.warn(
          "Element with class 'gallery-area' not found or is not an HTMLElement."
        );
      }
    }, 10);

    const checkContentHeight = debounce(() => {
      const galleryArea = document.querySelector(".gallery-area");

      if (galleryArea instanceof HTMLElement) {
        const galleryHeight = galleryArea.offsetHeight;
        const windowHeight = window.innerHeight;

        if (galleryHeight < windowHeight) {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }
      } else {
        console.warn(
          "Element with class 'gallery-area' is not an HTMLElement or was not found."
        );
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkContentHeight);
    checkContentHeight();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkContentHeight);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const galleryPhotos = data ? data.pages.flat() : [];

  // const uniqueGalleryPhotos = Array.from(
  //   new Map(galleryPhotos.map((photo) => [photo.key, photo])).values()
  // );

  return (
    <div className=""> 
      <RowsPhotoAlbum
        spacing={8}
        targetRowHeight={256}
        photos={galleryPhotos as GalleryPhoto[]}
        render={{ image: ImageRenderer }}
      />

      <Paper className="bottom-4 left-1/2 z-50 fixed bg-white shadow-lg rounded-full -translate-x-1/2 transform">
        <ToggleButtonGroup
          className="flex gap-2 m-1.5"
          size="small"
          value={tab}
          exclusive
          onChange={handleFilterChange}
        >
          <ToggleButton
            color="primary"
            className="-m-0.5 px-4 py-2 border-0 rounded-full normal-case"
            value="for-you"
          >
            For you
          </ToggleButton>
          <ToggleButton
            color="primary"
            className="-m-0.5 px-4 py-2 border-0 rounded-full normal-case"
            value="following"
          >
            Following
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {(isLoading || isFetchingNextPage) && (
        <div className="m-4 text-center">
          <LoadingSpinner />
        </div>
      )}
      {isError && (
        <div className="text-red-500 text-center">
          {(error as Error).message}
        </div>
      )}
    </div>
  );
};

export default IGallery;
