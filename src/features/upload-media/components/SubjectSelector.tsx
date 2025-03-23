import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Button, TextField } from "@mui/material";

type Subject = {
  label: string;
  description?: string;
  examples?: string[];
};

const allSubjects: Subject[] = [
  { label: "Abstract" },
  {
    label: "Anatom3y",
    description: "Anatomical studies of humans and animals.",
    examples: [
      "https://cdna.artstation.com/p/categories/example_images/000/000/194/thumb/jason-nguyen-villiansknightfinal-jasonnguyen.jpg?1587663685",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/195/thumb/alessandro-pizzi-lineup.jpg?1587663689",
      "https://cdna.artstation.com/p/categories/example_images/000/000/196/thumb/mauro-belfiore-cybalt.jpg?1587663693",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/197/thumb/samuel-youn-image.jpg?1587663696",
    ],
  },
  {
    label: "Anatomy5",
    description: "Anatomical studies of humans and animals.",
    examples: [
      "https://cdna.artstation.com/p/categories/example_images/000/000/194/thumb/jason-nguyen-villiansknightfinal-jasonnguyen.jpg?1587663685",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/195/thumb/alessandro-pizzi-lineup.jpg?1587663689",
      "https://cdna.artstation.com/p/categories/example_images/000/000/196/thumb/mauro-belfiore-cybalt.jpg?1587663693",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/197/thumb/samuel-youn-image.jpg?1587663696",
    ],
  },
  {
    label: "Anatomy1",
    description: "Anatomical studies of humans and animals.",
    examples: [
      "https://cdna.artstation.com/p/categories/example_images/000/000/194/thumb/jason-nguyen-villiansknightfinal-jasonnguyen.jpg?1587663685",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/195/thumb/alessandro-pizzi-lineup.jpg?1587663689",
      "https://cdna.artstation.com/p/categories/example_images/000/000/196/thumb/mauro-belfiore-cybalt.jpg?1587663693",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/197/thumb/samuel-youn-image.jpg?1587663696",
    ],
  },
  {
    label: "Anatomy2",
    description: "Anatomical studies of humans and animals.",
    examples: [
      "https://cdna.artstation.com/p/categories/example_images/000/000/194/thumb/jason-nguyen-villiansknightfinal-jasonnguyen.jpg?1587663685",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/195/thumb/alessandro-pizzi-lineup.jpg?1587663689",
      "https://cdna.artstation.com/p/categories/example_images/000/000/196/thumb/mauro-belfiore-cybalt.jpg?1587663693",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/197/thumb/samuel-youn-image.jpg?1587663696",
    ],
  },
  {
    label: "Anatomy3",
    description: "Anatomical studies of humans and animals.",
    examples: [
      "https://cdna.artstation.com/p/categories/example_images/000/000/194/thumb/jason-nguyen-villiansknightfinal-jasonnguyen.jpg?1587663685",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/195/thumb/alessandro-pizzi-lineup.jpg?1587663689",
      "https://cdna.artstation.com/p/categories/example_images/000/000/196/thumb/mauro-belfiore-cybalt.jpg?1587663693",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/197/thumb/samuel-youn-image.jpg?1587663696",
    ],
  },
  {
    label: "Animals & Wildlife",
    description: "Photos and drawings of animals and natural life.",
    examples: [
      "https://via.placeholder.com/120?text=Tiger",
      "https://via.placeholder.com/120?text=Bird",
    ],
  },
  {
    label: "Anime & Manga",
    description: "Anime and manga styled artworks and productions.",
    examples: [
      "https://via.placeholder.com/120?text=Anime+1",
      "https://via.placeholder.com/120?text=Anime+2",
      "https://via.placeholder.com/120?text=Anime+3",
    ],
  },
  { label: "Architectural Concepts" },
  { label: "Architectural Visualization" },
];

export default function SubjectSelector() {
  const [selected, setSelected] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<Subject>(allSubjects[0]);

  const toggleSubject = (subject: Subject) => {
    const exists = selected.some((s) => s.label === subject.label);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s.label !== subject.label));
      setSearch("");
    } else {
      if (selected.length < 3) {
        setSelected((prev) => [...prev, subject]);
        setSearch("");
      }
    }
  };

  const isSelected = (subject: Subject) =>
    selected.some((s) => s.label === subject.label);

  const remainingSlots = 3 - selected.length;

  return (
    <div className="dark:bg-mountain-900 dark:text-white font-sans">
      <p className="dark:text-mountain-200 mb-1">
        How would you categorize this work? (Choose up to 3)
      </p>
      {/* Top Selection Bar */}
      <div
        className={`flex items-center gap-2 flex-wrap dark:bg-mountain-950 rounded text-left mb-6 ${
          selected.length > 0 ? "px-3 py-2" : ""
        }`}
        style={{
          border: "2px solid #9d9d9d", // default
          borderRadius: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#e7e7e7"; // hover effect
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#9d9d9d"; // revert
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#e7e7e7"; // focus effect
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#9d9d9d"; // blur
        }}
        tabIndex={-1} // allow focus if needed
      >
        {selected.map((subject) => (
          <div
            key={subject.label}
            className="flex items-center gap-2 px-3 py-2 dark:bg-mountain-800 rounded text-sm"
          >
            <span>{subject.label}</span>
            <Button
              onClick={() => toggleSubject(subject)}
              variant="text"
              className="ml-1 !min-w-0 dark:text-white"
              component="label"
              size="small"
              sx={{
                backgroundColor: "transparent",
                padding: "0px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <CloseIcon
                fontSize="small"
                className="dark:text-white"
              />
            </Button>
          </div>
        ))}
        <TextField
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={selected.length === 0 ? "Choose art type" : ""}
          sx={{
            flex: 1,
            backgroundColor: "transparent",
            ".MuiOutlinedInput-notchedOutline": {
              border: "none", // optional: remove border if it's inside a styled box
            },
          }}
        />
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Left column */}
        <div className="w-64 border-r dark:border-gray-700 pr-4 h-72 flex flex-col">
          <p className="text-sm dark:text-gray-400 mb-3 py-1.5">
            CHOOSE ANOTHER {remainingSlots} ART TYPE
            {remainingSlots !== 1 ? "S" : ""}
          </p>
          <ul className="space-y-2 overflow-y-auto custom-scroll flex-1 pr-1">
            {allSubjects.map((subject) => {
              if (
                search &&
                !subject.label.toLowerCase().includes(search.toLowerCase())
              )
                return null;
              const selectedStatus = isSelected(subject);
              return (
                <li
                  key={subject.label}
                  className="flex justify-between items-center text-sm cursor-pointer gap-2 px-2 py-2 rounded dark:hover:bg-mountain-800 transition"
                  onMouseEnter={() => setHovered(subject)}
                >
                  <span>{subject.label}</span>
                  <Button
                    onClick={() => toggleSubject(subject)}
                    className="flex items-center gap-1 px-3 py-1 rounded border dark:border-gray-600 dark:text-white dark:hover:bg-mountain-900 dark:bg-mountain-950 "
                    sx={{
                      minWidth: "110px", // 👈 set a fixed or consistent min width
                      justifyContent: "center", // ensure content is centered
                    }}
                  >
                    {!selectedStatus ? (
                      <>
                        <AddIcon fontSize="small" className="text-blue-600" />
                        <span className="text-sm">Add</span>
                      </>
                    ) : (
                      <>
                        <CloseIcon fontSize="small" className="text-red-400" />
                        <span className="text-sm">Remove</span>
                      </>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right preview panel */}
        <div className="flex-1 !w-80">
          <div className="dark:bg-mountain-950 border border-indigo-300 rounded-lg p-5 h-full">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xl font-semibold">{hovered.label}</h3>
                <p className="dark:text-gray-300 text-sm">{hovered.description}</p>
              </div>
            </div>
            {hovered.examples && (
              <>
                <p className="text-sm dark:text-gray-400 mb-2">Examples</p>
                <div className="flex gap-3 overflow-x-auto">
                  {hovered.examples.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Example ${idx}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
