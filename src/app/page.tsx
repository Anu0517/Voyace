// src/app/page.tsx
"use client";

import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import InputForm from "./components/InputForm";
import GeminiQuery from "./components/GeminiQuery";

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

  const handleFormSubmit = (data: UserInput) => {
    setFormData(data);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <SignedOut>
        <h1 className="text-2xl font-semibold">Welcome! Please sign in to begin.</h1>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">🧭 Travel Planner</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <p className="text-gray-600 mb-4">Let’s plan your journey! Fill out the form below.</p>

          <InputForm onSubmit={handleFormSubmit} />
          {formData && <GeminiQuery formData={formData} />}
        </div>
      </SignedIn>
    </main>
  );
}