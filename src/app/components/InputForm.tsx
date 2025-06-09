// src/app/components/InputForm.tsx
"use client";

import { useState } from "react";

interface UserInput {
  destination: string;
  days: number;
  people: number;
  budget: number;
  foodPref: string;
  emotion: string;
}

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [formData, setFormData] = useState<UserInput>({
    destination: "",
    days: 0,
    people: 0,
    budget: 0,
    foodPref: "",
    emotion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "days" || name === "people" || name === "budget"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getInputValue = (value: number) => (value === 0 ? "" : String(value));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Plan Your Trip
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            placeholder="e.g., Paris"
            value={formData.destination}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="days"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Number of Days
          </label>
          <input
            type="number"
            id="days"
            name="days"
            placeholder="e.g., 3"
            value={getInputValue(formData.days)}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="people"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Number of People
          </label>
          <input
            type="number"
            id="people"
            name="people"
            placeholder="e.g., 2"
            value={getInputValue(formData.people)}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Budget (INR)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            placeholder="e.g., 50000"
            value={getInputValue(formData.budget)}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="foodPref"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Food Preferences
          </label>
          <input
            type="text"
            id="foodPref"
            name="foodPref"
            placeholder="e.g., Vegetarian"
            value={formData.foodPref}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="emotion"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Mood/Emotion
          </label>
          <input
            type="text"
            id="emotion"
            name="emotion"
            placeholder="e.g., Romantic"
            value={formData.emotion}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 dark:bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
}