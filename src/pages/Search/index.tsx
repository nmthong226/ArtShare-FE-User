//Core
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

//Icons
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { BsFilter } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbCategory } from "react-icons/tb";

//Context
import { useSearch } from "@/contexts/SearchProvider";

//Components
import { Input } from "@/components/ui/input";
import IGallery, { GalleryPhoto } from "@/components/gallery/Gallery";
import { DataPopper } from "@/components/carousels/categories/Categories";
import { Button } from "@/components/ui/button";
import SortMenu from "@/components/dropdowns/Sort";
import CategoryList from "@/components/filters/Filter";

//Libs/Utils/Helpers
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getMediaDimensions } from "@/utils/helpers/gallery.helper";
import { fetchPosts } from "@/features/explore/api/get-post";

//Types
import { Category, Post } from "@/types";
import { CategoryTypeValues } from "@/constants";
import { categoryService } from "@/components/carousels/categories/api/categories.api";

const Search = () => {
  const { query, setQuery } = useSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [, setShowChannelDropdown] = useState(false);
  const [tab, setTab] = useState<string>("posts");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openCP, setOpenCP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);
  const [sort, setSort] = useState("Sort by Relevance");

  const { data: allCategories } = useQuery<Category[], Error>({
    queryKey: ["allCategories"],
    queryFn: () => categoryService.getAllCategories(1, 200),
    staleTime: 1000 * 60 * 5,
  });

  const attributeCategories = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter(
      (cat) => cat.type === CategoryTypeValues.ATTRIBUTE,
    );
  }, [allCategories]);

  const galleryAreaRef = useRef<HTMLDivElement>(null);
  const {
    data: postsData,
    error: postsError,
    isError: isPostsError,
    isLoading: isLoadingPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", tab, query, selectedCategories],
    retry: 2,
    queryFn: async ({ pageParam = 1 }): Promise<GalleryPhoto[]> => {
      const posts: Post[] = await fetchPosts(
        pageParam,
        tab,
        query,
        selectedCategories,
      );
      const galleryPhotosPromises = posts
        .filter(
          (post) =>
            post.thumbnail_url || (post.medias && post.medias.length > 0),
        )
        .map(async (post): Promise<GalleryPhoto | null> => {
          try {
            const imageUrl = post.thumbnail_url || post.medias[0]?.url;
            if (!imageUrl) return null;
            const mediaDimensions = await getMediaDimensions(imageUrl);
            return {
              key: post.id.toString(),
              title: post.title || "",
              author: post.user?.username || "Unknown Author",
              src: imageUrl,
              width: mediaDimensions.width,
              height: mediaDimensions.height,
              postLength: post.medias?.length ?? 0,
              postId: post.id,
            };
          } catch (dimensionError) {
            console.error(
              `Error getting dimensions for post ${post.id}:`,
              dimensionError,
            );
            return null;
          }
        });
      const resolvedPhotos = await Promise.all(galleryPhotosPromises);
      return resolvedPhotos.filter(
        (photo): photo is GalleryPhoto => photo !== null,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  useEffect(() => {
    // Trigger your fetch or filter logic here
    console.log("Search query changed:", query);
  }, [query]);

  const handleToggleCP = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCP(event.currentTarget);
    setOpenCP((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const galleryElement = galleryAreaRef.current;
    if (!galleryElement) return;

    const handleScroll = () => {
      const scrollThreshold = 200;
      const scrolledFromTop = galleryElement.scrollTop;
      const elementHeight = galleryElement.clientHeight;
      const scrollableHeight = galleryElement.scrollHeight;

      if (
        elementHeight + scrolledFromTop >= scrollableHeight - scrollThreshold &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        console.log("Fetching next page...");
        fetchNextPage();
      }
    };

    const checkInitialContentHeight = () => {
      if (
        galleryElement.scrollHeight <= galleryElement.clientHeight &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoadingPosts
      ) {
        fetchNextPage();
      }
    };
    galleryElement.addEventListener("scroll", handleScroll);
    const timeoutId = setTimeout(checkInitialContentHeight, 500);
    return () => {
      galleryElement.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    postsData,
    isLoadingPosts,
  ]);

  const galleryPhotos: GalleryPhoto[] =
    postsData?.pages?.flat().filter(Boolean) ?? [];

  let isPostsDataEffectivelyEmpty = true;
  if (postsData && postsData.pages && Array.isArray(postsData.pages)) {
    if (
      postsData.pages.length > 0 &&
      postsData.pages.some((page) => page.length > 0)
    ) {
      isPostsDataEffectivelyEmpty = false;
    }
  }
  const isInitialGalleryLoading = isLoadingPosts && isPostsDataEffectivelyEmpty;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col items-center justify-end w-full pt-10 space-x-4 space-y-4 bg-white border-mountain-100 border-b-1 h-fit">
        <p className="inline-block text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Seek
        </p>
        <div className="flex items-center justify-center mb-6">
          <div className="relative flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl w-168 h-14 text-neutral-700 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-neutral-300">
            <FiSearch className="absolute w-5 h-5 left-2" />
            <Input
              ref={inputRef}
              className="w-full h-full pl-8 pr-8 shadow-inner rounded-2xl placeholder:text-mountain-400 md:text-lg"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuery(inputValue);
                  inputRef.current?.blur();
                  setSearchParams({ q: inputValue });
                }
              }}
            />
            <TiDeleteOutline
              className={`right-2 text-mountain-600 absolute w-5 h-5 ${inputValue.length <= 0 ? "hidden" : "flex"}`}
              onClick={() => {
                setInputValue("");
                setQuery("");
                setSearchParams({});
              }}
            />
          </div>
        </div>
      </div>
      <div className="sticky z-50 flex h-16 px-4 bg-white top-16">
        {/* Left side - Filter */}
        <div className="absolute flex items-center space-x-4 transform -translate-y-1/2 top-1/2 left-4">
          <div
            className={`flex items-center space-x-2 hover:bg-mountain-50 px-2 py-1 rounded-lg hover:cursor-pointer ${
              showFilters
                ? "text-mountain-950 font-medium"
                : "text-mountain-600 font-normal"
            }`}
            onClick={() => {
              setShowFilters((prev) => !prev);
              setShowChannelDropdown(false);
            }}
          >
            <BsFilter size={16} />
            <p>Filter</p>
          </div>

          {showFilters && (
            <div className="relative">
              <Button
                className="flex items-center justify-center w-32 py-1 bg-white border rounded-full cursor-pointer hover:bg-mountain-50 border-mountain-200 text-mountain-950"
                onClick={handleToggleCP}
              >
                <TbCategory size={16} />
                <p>Channels</p>
                <IoMdArrowDropdown />
              </Button>
              <DataPopper
                open={openCP}
                anchorEl={anchorElCP}
                onClose={() => setOpenCP(false)}
                onSave={(categories) => setSelectedCategories(categories)}
                selectedData={selectedCategories}
                data={attributeCategories}
                placement="bottom-start"
                renderItem="category"
              />
            </div>
          )}
        </div>
        {/* Center - Tabs */}
        <div className="absolute flex items-center h-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <div
            onClick={() => setTab("posts")}
            className={`${
              tab === "posts"
                ? "border-indigo-400"
                : "text-mountain-600 hover:bg-mountain-50 border-white hover:border-mountain-50"
            } hover:cursor-pointer flex justify-center items-center py-4 px-2 border-b-4 w-32 text-lg`}
          >
            Posts
          </div>
          <div
            onClick={() => setTab("users")}
            className={`${
              tab === "users"
                ? "border-indigo-400"
                : "text-mountain-600 hover:bg-mountain-50 border-white hover:border-mountain-50"
            } hover:cursor-pointer flex justify-center items-center py-4 px-2 border-b-4 w-32 text-lg`}
          >
            Users
          </div>
        </div>

        {/* Right side - Sort */}
        <div className="absolute flex items-center space-x-2 transform -translate-y-1/2 top-1/2 right-4">
          <SortMenu sort={sort} setSort={setSort} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full my-6">
        <div className="flex items-center justify-center w-full h-12">
          {selectedCategories.length > 0 ? (
            <>
              <p className="mr-2 text-mountain-400">In: </p>
              <CategoryList
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </>
          ) : (
            <div className="text-mountain-400">
              Tips: Want more specific results? Try adding filters.
            </div>
          )}
        </div>
        <div className="items-center justify-center w-full h-full p-4 mt-4 gallery-area">
          {/* <IGallery query={query} filter={selectedCategories}/> */}
          <IGallery
            photos={galleryPhotos}
            isLoading={isInitialGalleryLoading}
            isFetchingNextPage={isFetchingNextPage}
            isError={isPostsError}
            error={postsError as Error | null}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
