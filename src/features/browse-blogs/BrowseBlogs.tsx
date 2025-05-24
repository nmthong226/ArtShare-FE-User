/* src/features/browse-blogs/BrowseBlogs.tsx */
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Ellipsis, LoaderPinwheel } from "lucide-react";
import { AiFillFire } from "react-icons/ai";
import { IoHeartCircleOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

import {
  fetchTrendingBlogs,
  fetchFollowingBlogs,
  fetchBlogs,
  searchBlogs,
} from "@/features/blog-details/api/blog";
import { DataPopper } from "./components/Categories";
import BlogItem from "@/components/lists/BlogItem";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/contexts/SearchProvider";
import { categoriesData } from "@/utils/mocks";

import type { Blog } from "@/types/blog";
import "./BrowseBlogs.css";

const PAGE_SIZE = 12; // blogs per page

const BrowseBlogs: React.FC = () => {
  /* ───────── UI state ───────── */
  const [tab, setTab] = useState<"trending" | "following">("trending");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  /* popper for categories */
  const [openPop, setOpenPop] = useState(false);
  const [anchorPop, setAnchorPop] = useState<HTMLElement | null>(null);

  /* search */
  const [searchInput, setSearchInput] = useState("");
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();

  /* reset page when filters change */
  useEffect(() => setPage(1), [tab, selectedCategories, query]);

  /* ───────── fetch blogs ───────── */
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery<Blog[], Error>({
    queryKey: ["blogs", tab, selectedCategories, query, page],
    queryFn: async (): Promise<Blog[]> => {
      const skip = (page - 1) * PAGE_SIZE;

      if (query)
        return await searchBlogs({ take: PAGE_SIZE, skip, search: query });

      if (tab === "following")
        return await fetchFollowingBlogs({
          take: PAGE_SIZE,
          skip,
          categories: selectedCategories,
        });

      if (tab === "trending")
        return fetchTrendingBlogs({
          take: PAGE_SIZE,
          skip,
          categories: selectedCategories,
        });

      return await fetchBlogs({ take: PAGE_SIZE, skip });
    },
    select: (data) => (Array.isArray(data) ? data : []),
  });

  /* ───────── handlers ───────── */
  const toggleCategory = (name: string) =>
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );

  const clearCategories = () => setSelectedCategories([]);

  const handleTabChange = (_: any, val: string | null) =>
    val && setTab(val as "trending" | "following");

  const handlePageChange = (_: any, p: number) => setPage(p);

  const submitSearch = () => {
    setQuery(searchInput);
    navigate(`/blogs?q=${searchInput}`);
  };

  /* ───────── loading / error ───────── */
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-full text-red-600">
        `{isError} Fail to load message`
      </div>
    );

  /* ───────── JSX ───────── */
  return (
    <div className="flex h-screen rounded-t-3xl overflow-hidden">
      {/* ═══ Main list ═══ */}
      <div className="flex flex-col flex-1 w-[75%] pb-22">
        {/* Top bar */}
        <div className="sticky top-0 z-60 bg-white dark:bg-mountain-900 shadow-sm p-4 border-b dark:border-mountain-700">
          <div className="flex items-center space-x-4">
            {/* tabs */}
            <Paper className="shadow-none rounded-full bg-mountain-50 dark:bg-mountain-800">
              <ToggleButtonGroup
                size="small"
                exclusive
                value={tab}
                onChange={handleTabChange}
              >
                <ToggleButton value="trending" className="rounded-full">
                  <AiFillFire className="mr-1 size-4 text-mountain-400" />
                  Trending
                </ToggleButton>
                <ToggleButton value="following" className="rounded-full">
                  <IoHeartCircleOutline className="mr-1 size-4 text-mountain-400" />
                  Following
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

            {/* search */}
            <div className="relative flex flex-1 items-center">
              <FiSearch className="absolute left-2 w-5 h-5" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="Search"
                className="pl-8 pr-8 rounded-2xl shadow-inner w-full"
              />
              <TiDeleteOutline
                className={`absolute right-2 w-5 h-5 text-mountain-600 ${
                  searchInput ? "block" : "hidden"
                }`}
                onClick={() => {
                  setSearchInput("");
                  setQuery("");
                }}
              />
            </div>
          </div>
        </div>

        {/* list */}
        <div className="flex flex-col gap-4 p-4">
          {(blogs ?? []).length === 0 ? (
            <p className="text-center text-mountain-500">No blogs found.</p>
          ) : (
            (blogs ?? []).map((b) => (
              <BlogItem
                key={b.id}
                blogId={String(b.id)}
                title={b.title}
                content={b.content}
                thumbnail={
                  Array.isArray(b.pictures) && b.pictures[0]
                    ? b.pictures[0]
                    : "https://placehold.co/600x400"
                }
                author={{
                  username: b.user.username,
                  avatar: b.user.profile_picture_url ?? "",
                }}
                category={b.categories?.[0]?.name ?? ""}
                timeReading={`${Math.ceil((b.content ? b.content.split(/\s+/).length : 0) / 200)}m read`}
                dateCreated={new Date(b.created_at).toLocaleDateString()}
                like_count={b.like_count}
                comment_count={b.comment_count}
                view_count={b.view_count}
              />
            ))
          )}
        </div>

        {/* pagination */}
        <div className="flex justify-center py-6">
          <Stack spacing={2}>
            <Pagination count={10} page={page} onChange={handlePageChange} />
          </Stack>
        </div>
      </div>

      {/* ═══ right sidebar ═══ */}
      <div className="w-[25%] z-10 p-4 shadow-sm bg-gradient-to-t dark:bg-gradient-to-t from-white dark:from-mountain-1000 to-mountain-50 dark:to-mountain-950">
        {/* actions */}
        <div className="flex space-x-4">
          <Button
            variant="contained"
            className="w-12 h-12 min-w-0 dark:bg-mountain-900"
            onClick={(e) => {
              setAnchorPop(e.currentTarget);
              setOpenPop((o) => !o);
            }}
          >
            <Ellipsis />
          </Button>
          <DataPopper
            open={openPop}
            anchorEl={anchorPop}
            onClose={() => setOpenPop(false)}
            onSave={setSelectedCategories}
            selectedData={selectedCategories}
            data={categoriesData}
            placement="bottom-start"
            renderItem="category"
          />
          <Button
            variant={selectedCategories.length ? "outlined" : "contained"}
            className="flex gap-2 items-center rounded-lg p-2"
            onClick={clearCategories}
          >
            <LoaderPinwheel size={16} />
            All Channels
          </Button>
        </div>

        {/* category chips */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categoriesData.map((c) => {
            const active = selectedCategories.includes(c.name);
            return (
              <div
                key={c.name}
                onClick={() => toggleCategory(c.name)}
                className={`px-6 py-2 rounded-2xl cursor-pointer border ${
                  active ? "border-blue-500 shadow" : "border-gray-200"
                }`}
              >
                {c.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrowseBlogs;
