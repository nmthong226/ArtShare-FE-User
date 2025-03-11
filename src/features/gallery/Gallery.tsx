import React, { useState, useEffect, useRef } from "react";
import { fetchPhotos } from "./api/unsplashService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Photo } from "@/interfaces/Photo";
import Gallery from "react-photo-gallery";

export interface PhotoForGallery {
  src: string;
  width: number;
  height: number;
  alt?: string;
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

const IGallery: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loadedCount = useRef<number>(0);
  const prevPagePhotos = useRef<Photo[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoForGallery[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPhotos(page);
        const newPhotos = response.data.filter((photo: Photo) => !prevPagePhotos.current.find((prevPhoto) => prevPhoto.id === photo.id));
        const photoUrls = newPhotos.map((photo) => photo.urls.regular);
        const photosWithDimensions = await fetchPhotosWithDimensions(photoUrls);

        const galleryPhotos = photosWithDimensions.map((photoWithDim, index) => ({
          src: photoWithDim.url,
          width: photoWithDim.width,
          height: photoWithDim.height,
          alt: newPhotos[index]?.alt_description || newPhotos[index]?.description || "Untitled",
        }));

        setGalleryPhotos((prevPhotos) => [...prevPhotos, ...galleryPhotos]);
        console.log(galleryPhotos);

        prevPagePhotos.current = newPhotos;
        loadedCount.current = 0;
      } catch (error) {
        if (error instanceof Error) {
          setError(`Failed to load photos: ${error.message}`);
        } else {
          setError("Failed to load photos: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex w-screen items-center flex-col bg-zinc-50">
      <div className="py-8 flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center">Photo Gallery</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">A collection of beautiful photos from Unsplash</p>
      </div>
      <div className="container mx-auto">
        <Gallery photos={galleryPhotos} />
        {loading && (
          <div className="text-center m-4">
            <LoadingSpinner />
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default IGallery;
