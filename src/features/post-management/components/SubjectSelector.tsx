import React, { useEffect, useMemo, useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

import { Button, TextField } from "@mui/material";
import { getCategories } from "@/api/category";
import { Category } from "@/types";

// This is a type for Subject, which is a simplified version of Category to display on the UI.
type Subject = {
  id: number;
  name: string;
  description?: string | null;
  examples?: string[];
};

const SubjectSelector: React.FC<{
  cate_ids: number[];
  setCateIds: (value: number[]) => void;
}> = ({ setCateIds, cate_ids }) => {
  const [selected, setSelected] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [hovered, setHovered] = useState<Subject | undefined>(
    allSubjects?.[0] ?? undefined,
  );

  const toggleSubject = (subject: Subject) => {
    const exists = selected.some((s) => s.name === subject.name);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s.name !== subject.name));
      setSearch("");
    } else {
      if (selected.length < 3) {
        setSelected((prev) => [...prev, subject]);
        setSearch("");
      }
    }
  };

  useEffect(() => {
    setCateIds(selected.map((e) => e.id));
  }, [selected, setCateIds]);

  useEffect(() => {
    getCategories().then((apiCategories: Category[]) => {
      // 'apiCategories' is now correctly Category[]

      // Map ApiCategory to your local Subject type

      const subjects: Subject[] = apiCategories.map((cat) => ({
        id: cat.id,

        name: cat.name,

        description: cat.description,

        examples: cat.example_images, // Map example_images to examples

        // type: cat.type, // Map if needed
      }));

      setAllSubjects(subjects);

      setSelected(
        subjects.filter((subject: Subject) => cate_ids.includes(subject.id)),
      );
    });
  }, []);

  const isSelected = (subject: Subject) =>
    selected.some((s) => s?.name === subject?.name);

  const SubjectRow = React.memo(
    ({
      subject,
      isSelected,
      toggle,
      handleHover,
    }: {
      subject: Subject;
      isSelected: boolean;
      toggle: (s: Subject) => void;
      handleHover: (s: Subject) => void;
    }) => (
      <li
        className="flex justify-between items-center gap-2 hover:bg-gray-100 dark:hover:bg-mountain-800 px-2 py-2 rounded text-sm cursor-pointer"
        onMouseEnter={() => handleHover(subject)}
      >
        <span className="max-w-[60%] truncate">{subject.name}</span>
        {/* button kept identical */}
        <Button
          onClick={() => toggle(subject)}
          className={`${
            !isSelected && selected.length >= 3
              ? "dark:text-mountain-500 text-gray-400"
              : "dark:text-white text-black"
          } flex justify-center items-center gap-1 bg-white hover:bg-gray-100 dark:bg-mountain-950 dark:hover:bg-mountain-900 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded min-w-[110px] text-sm`}
          disabled={!isSelected && selected.length >= 3}
        >
          {!isSelected ? (
            <>
              <MdAdd size={16} className="text-indigo-500" />

              <span className="text-sm">Add</span>
            </>
          ) : (
            <>
              <MdClose size={16} className="text-red-400" />

              <span className="text-sm">Remove</span>
            </>
          )}
        </Button>
      </li>
    ),
  );

  const filteredSubjects = useMemo(() => {
    const l = search.toLowerCase();
    return allSubjects.filter((s) => !l || s.name.toLowerCase().includes(l));
  }, [allSubjects, search]);

  const remainingSlots = 3 - selected.length;

  return (
    <div className="dark:bg-mountain-900 font-sans text-black dark:text-white">
      <p className="mb-1 text-gray-800 dark:text-mountain-200 text-base">
        How would you categorize this work? (Choose up to 3)
      </p>
      {/* Top Selection Bar */}
      <div
        className={`flex items-center gap-2 flex-wrap dark:bg-mountain-900 min-h-[52px] bg-gray-100 text-left mb-6 transition-colors duration-200 ${
          selected.length > 0 ? "px-2 py-0.5" : ""
        }`}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#e7e7e7"; // mountain-100 hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#9ca3af"; // revert to default
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#a5b4fc"; // primary.main
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#9ca3af";
        }}
        tabIndex={-1}
      >
        {selected.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center gap-2 bg-gray-200 dark:bg-mountain-1000 px-2 py-1 rounded h-full text-sm"
          >
            <span>{subject.name}</span>
            <Button
              onClick={() => toggleSubject(subject)}
              variant="text"
              className="ml-1 !min-w-0"
              component="label"
              size="small"
              sx={{
                backgroundColor: "transparent",
                color: "inherit",
                padding: "0px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <MdClose size={16} className="text-inherit" />
            </Button>
          </div>
        ))}
        <TextField
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            selected.length < 3
              ? "Choose art type or search..."
              : "Maximum 3 selected"
          }
          disabled={selected.length >= 3}
          className=""
          sx={{
            flex: 1,
            backgroundColor: "transparent",
            ".MuiOutlinedInput-notchedOutline": {
              border: "2px solid",
              borderColor: "#9ca3af", // mountain-400 default
              borderRadius: "6px",
            },
          }}
        />
      </div>

      {/* Main layout */}
      <div
        className="
     grid gap-4 md:gap-2
     /* one column on phone, two columns ≥ md */
     grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px]   /* ⬅️ list grows, card 360 px */
     overflow-x-auto                                   /* scroll horizontally if needed */
     py-2
   "
      >
        {" "}
        <div className="flex flex-col  border-gray-300 dark:border-gray-700 pr-4 h-72 min-w-0">
          <p className="mb-3 py-1.5 text-gray-700 dark:text-gray-400 text-sm">
            CHOOSE ANOTHER {remainingSlots} ART TYPE
            {remainingSlots !== 1 ? "S" : ""}
          </p>
          <ul className="flex-1 space-y-2 pr-1 overflow-y-auto custom-scroll">
            {filteredSubjects.map((subject) => (
              <SubjectRow
                key={subject.id}
                subject={subject}
                isSelected={isSelected(subject)}
                toggle={toggleSubject}
                handleHover={(s) => {
                  if (hovered?.id !== s.id) setHovered(s);
                }}
              />
            ))}
          </ul>
        </div>
        {/* Right preview panel */}
        <div
          className="
            w-full                                                                 /* Default to full width (for stacked view) */
            md:min-w-[320px] md:max-w-[320px]                                      /* Apply min/max width only from md breakpoint */
            lg:min-w-[380px] lg:max-w-[380px]                                      /* Apply larger min/max width from lg breakpoint */
            h-72                                                                   /* Fixed height */
            md:flex-shrink-0                                                       /* Apply flex-shrink-0 only from md breakpoint */
            overflow-hidden                                                        /* Consistent overflow handling */
          "
        >
          {" "}
          <div
            className="
      bg-gray-100 dark:bg-mountain-950 p-5 border border-indigo-300 rounded-lg
      h-full flex flex-col overflow-hidden   /* card takes full height */
    "
          >
            <div className="mb-3">
              {" "}
              {/* Just keep the margin-bottom */}
              <h3 className="font-semibold text-xl">{hovered?.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {hovered?.description}
              </p>
            </div>
            {hovered?.examples !== undefined ? ( // Check if examples property *exists* on the hovered object
              <>
                <p className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
                  Examples
                </p>
                {hovered.examples.length > 0 ? ( // If examples array is not empty, show images
                  <div className="flex gap-3 overflow-x-auto max-w-full">
                    {" "}
                    {/* Added custom-scroll-x for potential horizontal scrollbar styling */}
                    {hovered.examples.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Example ${idx + 1} for ${hovered.name}`} // Improved alt text
                        className="rounded w-40 h-40 object-cover flex-shrink-0" // Added flex-shrink-0 to prevent shrinking in flex container
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : (
                  // If examples array is empty, show the message
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    No examples available for this art type.
                  </p>
                )}
              </>
            ) : // This block will execute if 'hovered.examples' is literally undefined.
            // If your 'examples' property always exists (even as an empty array),
            // this 'else' part might not be reached.
            // You can put a placeholder here or 'null' if 'examples' might be missing.
            null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
