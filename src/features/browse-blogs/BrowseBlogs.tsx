import React, { useState, useRef, useEffect } from "react";

//Libs
// import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, CircularProgress, Pagination, Paper, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

//Icons
import { Ellipsis, LoaderPinwheel } from "lucide-react";
import { AiFillFire } from "react-icons/ai";
import { IoHeartCircleOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

//Components
import { DataPopper } from "./components/Categories";
import { useSearch } from "@/contexts/SearchProvider";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

//Mocks
import { BlogList, categoriesData } from "@/utils/mocks";

//Style
import './BrowseBlogs.css'
import BlogItem from "../../components/lists/BlogItem";

const BrowseBlogs: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openCP, setOpenCP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<string>("trending");
  const blogAreaRef = useRef<HTMLDivElement>(null);

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
    <div className="flex rounded-t-3xl h-screen overflow-hidden">
      {loading ?
        <div className="flex justify-center items-center space-x-4 w-full h-[calc(100vh-20rem)] sidebar">
          <CircularProgress size={36} />
          <p>Loading...</p>
        </div> :
        <>
          <div className="relative flex flex-col flex-1 pb-22 w-[75%] sidebar">
            <div className="top-0 z-60 sticky bg-white dark:bg-mountain-900 shadow-sm px-4 py-4 border-gray-200 dark:border-mountain-700 border-b">
              <div className="flex justify-between items-center space-x-4">
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
                <div className="relative flex flex-1 items-center dark:bg-mountain-1000 rounded-2xl w-full h-10 text-neutral-700 dark:text-neutral-300">
                  <FiSearch className="left-2 absolute w-5 h-5" />
                  <Input
                    ref={inputRef}
                    className="flex flex-1 bg-white shadow-inner pr-8 pl-8 rounded-2xl w-full"
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
            </div>
            <div
              ref={blogAreaRef}
              className="flex flex-col gap-y-4 space-y-12 p-4">
              {BlogList.map((blog) => (
                <BlogItem
                  blogId={blog.blogId}
                  title={blog.title}
                  content={blog.content}
                  thumbnail={blog.thumbnail}
                  author={blog.user}
                  timeReading={blog.timeReading}
                  dateCreated={blog.dateCreated}
                  category={blog.category}
                  like_count={blog.like_count}
                  comment_count={blog.comment_count}
                  view_count={blog.view_count}
                />
              ))}
            </div>
            <div className="z-50 flex justify-center items-center mt-20 w-full">
              <div className="flex items-center space-x-1 bg-white pl-2 border border-mountain-200 rounded-lg w-24">
                <p>Page: </p>
                <Input placeholder={page.toString()} className="shadow-none border-0" />
              </div>
              <Stack spacing={2} className="flex space-x-2">
                <Pagination count={10} page={page} onChange={handleChange} />
              </Stack>
            </div>
          </div>
          <div className="z-10 flex flex-col gap-4 bg-gradient-to-t dark:bg-gradient-to-t from-white dark:from-mountain-1000 to-mountain-50 dark:to-mountain-950 shadow-sm p-4 w-[25%]">
            <div className="flex flex-col gap-6 w-full categories-bar">
              <div className="flex space-x-4 shrink-0">
                <Button
                  className="flex flex-shrink-0 gap-2 dark:bg-mountain-900 shadow-none p-2 rounded-lg w-12 min-w-auto h-12 aspect-[1/1] font-normal dark:text-mountain-50 normal-case all-channels-btn"
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
              </div>
              <div className="flex flex-wrap flex-1 gap-2">
                {categoriesData.map((category, id) => {
                  const isSelected = selectedCategories.includes(category.name);
                  return (
                    <div
                      key={id}
                      className={`flex flex-col cursor-pointer hover:scale-105 duration-300 ease-in-out justify-center items-center bg-white px-6 py-2 border rounded-2xl shadow-sm w-fit text-center transition-all ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                      onClick={() => handleCategoriesChange(category.name)}
                    >
                      <span className="font-thin text-gray-800 dark:text-mountain-200 text-base line-clamp-1 select-none">
                        {category.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default BrowseBlogs;
