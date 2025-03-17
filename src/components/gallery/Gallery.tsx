import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { fetchPhotos } from "./api/unsplashService";
import LoadingSpinner from "@/components/LoadingSpinner";
import Gallery, { PhotoProps, RenderImageProps } from "react-photo-gallery";
import ImageRenderer from "./ImageRenderer";

export interface GalleryPhoto extends PhotoProps {
  id: string;
  post: Post;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  images: GalleryPhoto[];
}

const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
};

const fetchPhotosWithDimensions = async (photoUrls: string[]) => {
  const photosWithDimensions = await Promise.all(
    photoUrls.map(async (url) => {
      try {
        const dimensions = await getImageDimensions(url);
        return { url, ...dimensions };
      } catch (error) {
        console.error(`Failed to load dimensions for image ${url}:`, error);
        return { url, width: 0, height: 0 };
      }
    })
  );
  return photosWithDimensions;
};

const mockPosts = (photos: GalleryPhoto[]): Post[] => {
  const posts: Post[] = [];
  let toggleSingleImagePost = true;

  for (let i = 0; i < photos.length; ) {
    const images = toggleSingleImagePost
      ? photos.slice(i, i + 1) // Single-image post
      : photos.slice(i, i + 3); // Multi-image post

    if (images.length > 0) {
      posts.push({
        id: `post-${i}`,
        title: `Post ${posts.length + 1}`,
        author: `Author ${posts.length + 1}`,
        images,
      });
    }

    i += images.length;

    toggleSingleImagePost = !toggleSingleImagePost;
  }

  return posts;
};

const IGallery: React.FC = () => {
  const { data, error, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<GalleryPhoto[], Error>(
    "photos",
    async ({ pageParam = 1 }) => {
      const response = await fetchPhotos(pageParam);

      const photosData = response.data.map((photo) => ({
        id: photo.id,
        url: photo.urls.regular,
      }));

      const photoUrls = photosData.map((photo) => photo.url);
      const photosWithDimensions = await fetchPhotosWithDimensions(photoUrls);

      const galleryPhotos: GalleryPhoto[] = photosWithDimensions.map((photoDim, index) => ({
        id: photosData[index].id,
        src: photoDim.url,
        width: photoDim.width,
        height: photoDim.height,
        post: { id: "", title: "", author: "", images: [] },
      }));

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

  const uniqueGalleryPhotos = Array.from(new Map(galleryPhotos.map((photo) => [photo.id, photo])).values());

  const posts = mockPosts(uniqueGalleryPhotos);

  return (
    <div className="-mx-0.5">
      <Gallery
        photos={posts.map((post) => ({
          id: post.images[0].id,
          src: post.images[0].src,
          width: post.images[0].width,
          height: post.images[0].height,
          alt: post.title,
          post,
        }))}
        renderImage={ImageRenderer as React.ComponentType<RenderImageProps>}
      />

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
