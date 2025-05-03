import React, { useState, useRef, useEffect } from "react";

//Libs
// import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";

//Icons
import { Ellipsis, LoaderPinwheel } from "lucide-react";
import { AiFillFire } from "react-icons/ai";
import { IoHeartCircleOutline } from "react-icons/io5";

//Components
import { Categories, DataPopper } from "./components/Categories";
import { BlogList, categoriesData } from "./mocks";
import { useSearch } from "@/contexts/SearchProvider";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { TiDeleteOutline } from "react-icons/ti";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

//Style
import './BrowseBlogs.css'
import LoadingSpinner from "@/components/fallbacks/LoadingSpinner";
import BlogCard from "@/components/cards/BlogCard";

// import IGallery, { GalleryPhoto } from "@/components/gallery/Gallery";

// import { Post } from "@/types";
// import { fetchPosts } from "./api/get-post";

//Contexts
// import { useSearch } from "@/contexts/SearchProvider";

// const getMediaDimensions = (
//   url: string,
// ): Promise<{ width: number; height: number }> => {
//   return new Promise((resolve) => {
//     if (!url) {
//       resolve({ width: 500, height: 500 });
//       return;
//     }
//     const img = new Image();
//     img.onload = () => resolve({ width: img.width, height: img.height });
//     img.onerror = (err) => {
//       console.error("Error loading image for dimensions:", url, err);

//       resolve({ width: 500, height: 500 });
//     };
//     img.src = url;
//   });
// };

const BrowseBlogs: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openCP, setOpenCP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<string>("trending");
  const galleryAreaRef = useRef<HTMLDivElement>(null);
  // const { query } = useSearch();
  // const {
  //   data,
  //   error,
  //   isError,
  //   isLoading,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ["posts", tab, query, selectedCategories],
  //   retry: 2,
  //   queryFn: async ({ pageParam = 1 }): Promise<GalleryPhoto[]> => {
  //     const posts: Post[] = await fetchPosts(
  //       pageParam,
  //       tab,
  //       query,
  //       selectedCategories,
  //     );
  //     console.log("Fetched posts:", posts);

  //     const galleryPhotosPromises = posts
  //       .filter(
  //         (post) =>
  //           post.thumbnail_url || (post.medias && post.medias.length > 0),
  //       )
  //       .map(async (post): Promise<GalleryPhoto | null> => {
  //         try {
  //           const imageUrl = post.thumbnail_url || post.medias[0]?.url;
  //           if (!imageUrl) return null;

  //           const mediaDimensions = await getMediaDimensions(imageUrl);
  //           return {
  //             key: post.id.toString(),
  //             title: post.title || "",
  //             author: post.user?.full_name || "Unknown Author",
  //             src: imageUrl,
  //             width: mediaDimensions.width,
  //             height: mediaDimensions.height,
  //             postLength: post.medias?.length ?? 0,
  //             postId: post.id,
  //           };
  //         } catch (dimensionError) {
  //           console.error(
  //             `Error getting dimensions for post ${post.id}:`,
  //             dimensionError,
  //           );
  //           return null;
  //         }
  //       });

  //     const resolvedPhotos = await Promise.all(galleryPhotosPromises);

  //     return resolvedPhotos.filter((photo) => photo !== null) as GalleryPhoto[];
  //   },
  //   initialPageParam: 1,
  //   getNextPageParam: (lastPage, allPages) => {
  //     return lastPage.length > 0 ? allPages.length + 1 : undefined;
  //   },
  // });

  const handleCategoriesChange = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName],
    );
  };

  const handleToggleCP = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCP(event.currentTarget);
    setOpenCP((prevOpen) => !prevOpen);
  };

  const handleTabChange = (
    _: React.MouseEvent<HTMLElement>,
    newTab: string | null,
  ) => {
    if (newTab) {
      setTab(newTab);
    }
  };

  // useEffect(() => {
  //   const galleryElement = galleryAreaRef.current;
  //   if (!galleryElement) return;

  //   const handleScroll = () => {
  //     const scrollThreshold = 200;
  //     const scrolledFromTop = galleryElement.scrollTop;
  //     const elementHeight = galleryElement.clientHeight;
  //     const scrollableHeight = galleryElement.scrollHeight;

  //     if (
  //       elementHeight + scrolledFromTop >= scrollableHeight - scrollThreshold &&
  //       hasNextPage &&
  //       !isFetchingNextPage
  //     ) {
  //       console.log("Fetching next page...");
  //       fetchNextPage();
  //     }
  //   };

  //   const checkInitialContentHeight = () => {
  //     if (
  //       galleryElement.scrollHeight <= galleryElement.clientHeight &&
  //       hasNextPage &&
  //       !isFetchingNextPage &&
  //       !isLoading
  //     ) {
  //       console.log("Initial content too short, fetching next page...");
  //       fetchNextPage();
  //     }
  //   };

  //   galleryElement.addEventListener("scroll", handleScroll);

  //   const timeoutId = setTimeout(checkInitialContentHeight, 500);

  //   return () => {
  //     galleryElement.removeEventListener("scroll", handleScroll);
  //     clearTimeout(timeoutId);
  //   };
  // }, [fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading]);

  // const galleryPhotos: GalleryPhoto[] =
  //   data?.pages?.flat().filter(Boolean) ?? [];
  // console.log("Processed galleryPhotos:", galleryPhotos);

  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Query updated:", query);
  }, [query]);

  const [page, setPage] = React.useState(1);
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    if (BlogList.length === 0) return;

    let loadedCount = 0;
    const totalImages = BlogList.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setLoading(false);
      }
    };

    BlogList.forEach((blog) => {
      const img = new Image();
      img.src = blog.thumbnail;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // handle broken image case
    });
  }, [BlogList]);

  return (
    <div className="relative flex flex-col pb-22 h-full">
      <div className="top-16 z-10 sticky flex flex-col gap-4 bg-gradient-to-t dark:bg-gradient-to-t from-white dark:from-mountain-1000 to-mountain-50 dark:to-mountain-950 shadow-sm p-4">
        <div className="flex items-center gap-6 w-full categories-bar">
          <Button
            className="flex flex-shrink-0 gap-2 dark:bg-mountain-900 shadow-none p-2 rounded-lg min-w-auto aspect-[1/1] font-normal dark:text-mountain-50 normal-case all-channels-btn"
            variant="contained"
            disableElevation
            onClick={handleToggleCP}
          >
            <Ellipsis />
          </Button>
          <DataPopper
            open={openCP}
            anchorEl={anchorElCP}
            onClose={() => setOpenCP(false)}
            onSave={(categories) => setSelectedCategories(categories)}
            selectedData={selectedCategories}
            data={categoriesData}
            placement="bottom-start"
            renderItem="category"
          />
          <Button
            className={`all-channels-btn flex gap-2 flex-shrink-0 rounded-lg p-2 ${selectedCategories.length === 0
              ? "bg-mountain-200 dark:bg-mountain-800"
              : "dark:bg-mountain-900"
              } text-gray-800 dark:text-mountain-200 normal-case font-normal shadow-none`}
            variant={selectedCategories.length === 0 ? "contained" : "outlined"}
            onClick={() => setSelectedCategories([])}
            disableElevation={selectedCategories.length === 0}
          >
            <div
              className={`p-2 rounded aspect-[1/1] ${selectedCategories.length === 0
                ? "bg-mountain-100 text-mountain-950"
                : "bg-mountain-100 dark:bg-mountain-700"
                }`}
            >
              <LoaderPinwheel size={16} />
            </div>
            <span className="flex-shrink-0">All Channels</span>
          </Button>

          <div className="flex-grow overflow-x-auto scrollbar-hide">
            <Categories
              onSelectCategory={handleCategoriesChange}
              selectedCategories={selectedCategories}
            />
          </div>
        </div>
      </div>
      <div className="z-0 flex justify-between items-center space-x-4 my-4 px-4 w-full">
        <Paper className="z-50 flex justify-between bg-mountain-50 dark:bg-mountain-800 shadow-none rounded-full">
          <ToggleButtonGroup
            className="z-0 flex space-x-2"
            size="small"
            value={tab}
            exclusive
            onChange={handleTabChange}
            aria-label="Filter posts"
          >
            <ToggleButton
              color="primary"
              className="flex items-center bg-white data-[selected]:bg-white shadow-md rounded-full w-30 data-[selected]:dark:text-white dark:text-mountain-100 normal-case"
              value="trending"
            >
              <AiFillFire className="mr-1 size-4 text-mountain-400" />
              <p>Trending</p>
            </ToggleButton>
            <ToggleButton
              color="primary"
              className="bg-mountain-50 data-[selected]:bg-white shadow-md rounded-full w-30 data-[selected]:dark:text-white dark:text-mountain-100 normal-case"
              value="following"
            >
              <IoHeartCircleOutline className="mr-1 size-4 text-mountain-400" />
              <p>Following</p>
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
        <div className={`flex relative items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl h-full text-neutral-700 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-neutral-300 transition-all duration-300 ease-in-out w-full`}>
          <FiSearch className="left-2 absolute w-5 h-5" />
          <Input
            ref={inputRef}
            className="bg-white shadow-inner pr-8 pl-8 rounded-2xl h-10"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setInputValue("");
                setQuery(inputValue);
                inputRef.current?.blur();
                navigate(`/search?q=${inputValue}`);
              }
            }}
          />
          <TiDeleteOutline
            className={`right-2 text-mountain-600 absolute w-5 h-5 ${inputValue.length <= 0 ? "hidden" : "flex"}`}
            onClick={() => {
              setInputValue("");
              setQuery("");
            }}
          />
        </div>
      </div>
      {loading ?
        <div className="flex justify-center items-center w-full h-[calc(100vh-20rem)]">
          <LoadingSpinner />
        </div> :
        <div
          ref={galleryAreaRef}
          className="gap-x-4 gap-y-8 grid grid-cols-4 p-4 overflow-y-auto">
          {BlogList.map((blog) => (
            <BlogCard
              blogId={blog.blogId}
              thumbnail={blog.thumbnail}
              title={blog.title}
              author={blog.author}
              timeReading={blog.timeReading}
              dateCreated={blog.dateCreated}
              category={blog.category}
              like_count={blog.like_count}
              comment_count={blog.comment_count}
              view_count={blog.view_count}
            />
          ))}
        </div>
      }
      <div className="bottom-6 absolute flex justify-center items-center w-full">
        <div className="flex items-center space-x-1 bg-white pl-2 border border-mountain-200 rounded-lg w-24">
          <p>Page: </p>
          <Input placeholder={page.toString()} className="shadow-none border-0" />
        </div>
        <Stack spacing={2} className="flex space-x-2">
          <Pagination count={10} page={page} onChange={handleChange} />
        </Stack>
      </div>
    </div>
  );
};

export default BrowseBlogs;
