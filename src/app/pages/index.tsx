// src/app/pages/index.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import InputForm from "../components/InputForm";
import GeminiQuery from "../components/GeminiQuery";
import { useState, useEffect } from "react";

interface UserInput {
  destination: string;
  days: number;
  people: number;
  budget: number;
  foodPref: string;
  emotion: string;
}

export default function Home() {
  const [formData, setFormData] = useState<UserInput | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme as "light" | "dark");
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleFormSubmit = (data: UserInput) => {
    setFormData(data);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 0h-2"
              />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight">Travel Planner</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
            >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white dark:bg-gray-700 dark:text-white text-blue-600 dark:hover:bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="p-6 flex-grow">
        <SignedIn>
          <div className="max-w-5xl mx-auto">
            <InputForm onSubmit={handleFormSubmit} />
            {formData && <GeminiQuery formData={formData} />}
          </div>
        </SignedIn>
        <SignedOut>
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to plan your trip with our chatbot.
            </p>
          </div>
        </SignedOut>
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Travel Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}