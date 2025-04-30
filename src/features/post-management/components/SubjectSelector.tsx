import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Button, TextField } from "@mui/material";
import { getCategories } from "@/api/category";

type Subject = {
  label: string;
  description?: string;
  examples?: string[];
  id: number;
};

const SubjectSelector: React.FC<{
  setCateIds: (value: number[]) => void;
}> = ({ setCateIds }) => {
  const [selected, setSelected] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [hovered, setHovered] = useState<Subject | undefined>(
    allSubjects?.[0] ?? undefined,
  );

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

  useEffect(() => {
    setCateIds(selected.map((e) => e.id));
  }, [selected]);

  useEffect(() => {
    getCategories().then((data) => {
      setAllSubjects(data.data.data);
    });
  }, []);

  const isSelected = (subject: Subject) =>
    selected.some((s) => s?.label === subject?.label);

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
            key={subject.label}
            className="flex items-center gap-2 bg-gray-200 dark:bg-mountain-1000 px-2 py-1 rounded h-full text-sm"
          >
            <span>{subject.label}</span>
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
              <CloseIcon fontSize="small" className="text-inherit" />
            </Button>
          </div>
        ))}
        <TextField
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"Choose art type"}
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
      <div className="flex gap-2">
        {/* Left column */}
        <div className="flex flex-col pr-4 border-gray-300 dark:border-gray-700 w-1/2 h-72">
          <p className="mb-3 py-1.5 text-gray-700 dark:text-gray-400 text-sm">
            CHOOSE ANOTHER {remainingSlots} ART TYPE
            {remainingSlots !== 1 ? "S" : ""}
          </p>
          <ul className="flex-1 space-y-2 pr-1 overflow-y-auto custom-scroll">
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
                  className="flex justify-between items-center gap-2 hover:bg-gray-100 dark:hover:bg-mountain-800 px-2 py-2 rounded text-sm transition cursor-pointer"
                  onMouseEnter={() => setHovered(subject)}
                >
                  <span className="max-w-[60%] truncate">{subject.label}</span>
                  <Button
                    onClick={() => toggleSubject(subject)}
                    className={`${selected.length >= 3 && !selectedStatus ? "dark:text-mountain-500 text-gray-400" : "dark:text-white text-black"} flex justify-center items-center gap-1 bg-white hover:bg-gray-100 dark:bg-mountain-950 dark:hover:bg-mountain-900 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded min-w-[110px] text-black  text-sm`}
                    sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                    disabled={!selectedStatus && selected.length >= 3}
                  >
                    {!selectedStatus ? (
                      <>
                        <AddIcon fontSize="small" className="text-indigo-500" />
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
        <div className="flex-1 w-1/2 overflow-hidden">
          <div className="bg-gray-100 dark:bg-mountain-950 p-5 border border-indigo-300 rounded-lg h-full">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-semibold text-xl">{hovered?.label}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {hovered?.description}
                </p>
              </div>
            </div>
            {hovered?.examples && (
              <>
                <p className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
                  Examples
                </p>
                <div className="flex gap-3 overflow-x-auto">
                  {hovered.examples.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Example ${idx}`}
                      className="rounded w-40 h-40 object-cover"
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

export default SubjectSelector;
