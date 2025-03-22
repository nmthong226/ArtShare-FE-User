import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

type Subject = {
  label: string;
  description?: string;
  examples?: string[];
};

const allSubjects: Subject[] = [
  { label: "Abstract" },
  {
    label: "Anatomy",
    description: "Anatomical studies of humans and animals.",
    examples: [
      "https://via.placeholder.com/120?text=Dog",
      "https://via.placeholder.com/120?text=Eye",
      "https://via.placeholder.com/120?text=Torso",
      "https://via.placeholder.com/120?text=Hand",
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
  const [hovered, setHovered] = useState<Subject | null>(null);

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
    <div className="bg-[#1e1e1e] text-white p-6 rounded-xl max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-2">Art type</h2>
      <p className="text-gray-400 mb-4">
        How would you categorize this work? (Choose up to 3)
      </p>

      {/* Top Selection Bar */}
      <div className="flex items-center gap-2 flex-wrap border border-gray-600 rounded-lg px-3 py-2 bg-[#2a2a2a] mb-6">
        {selected.map((subject) => (
          <div
            key={subject.label}
            className="flex items-center gap-1 px-3 py-1 bg-gray-700 rounded-full text-sm"
          >
            <span>{subject.label}</span>
            <Button
              onClick={() => toggleSubject(subject)}
              className="ml-1 !text-gray-300 !min-w-0"
            >
              <CloseIcon fontSize="small" />
            </Button>
          </div>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Choose art type"
          className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-1 text-sm"
        />
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Left column */}
        <div className="w-64 border-r border-gray-700 pr-4 h-72 overflow-y-auto custom-scroll">
          <p className="text-sm text-gray-400 mb-3 sticky top-0 bg-[#1e1e1e] z-2 py-1.5">
            CHOOSE ANOTHER {remainingSlots} SUBJECT
            {remainingSlots !== 1 ? "S" : ""}
          </p>
          <ul className="space-y-2">
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
                  className="flex justify-between items-center text-sm cursor-pointer gap-2"
                  onMouseEnter={() => setHovered(subject)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span>{subject.label}</span>
                  <Button
                    onClick={() => toggleSubject(subject)}
                    className={`flex items-center gap-1 px-3 py-1 rounded border border-gray-600 text-white hover:bg-[#2a2a2a] bg-[#1e1e1e]`}
                  >
                    {!selectedStatus ? (
                      <>
                        <AddIcon fontSize="small" className="text-blue-400" />
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
        {hovered && hovered.description && (
          <div className="flex-1">
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{hovered.label}</h3>
                  <p className="text-gray-300 text-sm">{hovered.description}</p>
                </div>
                <Button
                  onClick={() => setHovered(null)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <CloseIcon />
                </Button>
              </div>
              {hovered.examples && (
                <>
                  <p className="text-sm text-gray-400 mb-2">Examples</p>
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
        )}
      </div>
    </div>
  );
}
