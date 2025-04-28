// Onboarding.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Onboarding = () => {
  const [username, setUsername] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  return (
    <div className="flex-1 space-y-6 px-10 md:px-0 lg:px-20 py-10">
      {/* headline */}
      <h1 className="font-extrabold text-mountain-800 dark:text-mountain-50 text-2xl lg:text-3xl">
        Join ArtShare
      </h1>

      {/* username */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
        >
          Pick a username
        </label>

        <Input
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="dark:bg-mountain-900 shadow-sm p-3 border border-mountain-800 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10
                     text-mountain-950 dark:text-mountain-50"
        />
      </div>

      {/* birthday */}
      <div className="space-y-2">
        <span className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm">
          Date of Birth
        </span>

        <div className="flex gap-2">
          {/* month */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="flex-1 h-10 px-3 border border-mountain-800 rounded-lg
                       bg-white dark:bg-mountain-900 dark:text-mountain-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Month</option>
            {months.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          {/* day */}
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="flex-1 h-10 px-3 border border-mountain-800 rounded-lg
                       bg-white dark:bg-mountain-900 dark:text-mountain-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {/* year */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="flex-1 h-10 px-3 border border-mountain-800 rounded-lg
                       bg-white dark:bg-mountain-900 dark:text-mountain-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Year</option>
            {Array.from({ length: 110 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* primary action */}
      <Button className="bg-mountain-800 hover:bg-mountain-700 dark:bg-gradient-to-r dark:from-blue-800 dark:via-purple-700 dark:to-pink-900 hover:brightness-110 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full h-10 font-bold text-white dark:text-mountain-50 hover:cursor-pointer">
        Join
      </Button>

      {/* footer */}
      <p className="text-mountain-600 dark:text-mountain-100 text-xs text-center">
        Already a member?
        <Link to="/login" className="ml-1 text-indigo-600 dark:text-indigo-300">
          Log In
        </Link>
      </p>

      <div className="text-[10px] text-mountain-500 dark:text-mountain-300 text-center">
        By joining ArtShare, I confirm that I have read and agree to the&nbsp;
        <a href="#" className="text-indigo-600 dark:text-indigo-300">
          Terms of Service
        </a>{" "}
        and&nbsp;
        <a href="#" className="text-indigo-600 dark:text-indigo-300">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};

export default Onboarding;
