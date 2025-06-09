"use client";

import { useState, useEffect } from "react";
import ItineraryText from "./ItineraryText";
import HotelCard from "./HotelCard";
import AttractionCard from "./AttractionCard";

interface UserInput {
  destination: string;
  days: number;
  people: number;
  budget: number;
  foodPref: string;
  emotion: string;
}

interface ParsedResponse {
  itinerary: string;
  hotels: { name: string; link: string; imageUrl: string }[];
  attractions: { name: string; imageUrl: string }[];
}

export default function GeminiQuery({ formData }: { formData: UserInput }) {
  const [response, setResponse] = useState<ParsedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedLang, setSelectedLang] = useState("en-US");

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const voice = availableVoices.find((v) => v.lang === selectedLang) || availableVoices[0] || null;
      setSelectedVoice(voice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedLang]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Construct the prompt using formData
      const prompt = `Plan a ${formData.days}-day trip for ${formData.people} people to ${
        formData.destination
      }. Budget: ${formData.budget} INR. Food preferences: ${
        formData.foodPref || "none"
      }. Mood: ${formData.emotion || "general"}. Provide the following in a structured format:

      1. **Itinerary**: A detailed daily itinerary with days in bold (e.g., **Day 1: ...**) and activities as bullet points (e.g., * Activity 1...).
      2. **Hotels**: A list of specific hotel recommendations in the format:
         Hotel: [Hotel Name], [Booking Link], [Image URL]
         Example: Hotel: Baan Thai House, https://booking.com/baan-thai-house, /images/placeholder.jpg
         Provide at least 2 specific hotels with real names, links, and image URLs (use placeholder URLs if necessary, e.g., /images/placeholder.jpg).
      3. **Attractions**: A list of specific tourist attractions in the format:
         Attraction: [Attraction Name], [Image URL]
         Example: Attraction: Eiffel Tower, /images/placeholder.jpg
         Provide at least 2 specific attractions with real names and image URLs (use placeholder URLs if necessary).

      Ensure all sections are clearly labeled (Itinerary, Hotels, Attractions) and follow the specified formats.`;

      // Make the API call
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("Raw Gemini API response:", data.response);

      const parsedResponse: ParsedResponse = parseGeminiResponse(data.response);
      console.log("Parsed response:", parsedResponse);
      setResponse(parsedResponse);
    } catch (err) {
      console.error("Error generating response:", err);
      setResponse({
        itinerary: "Error generating itinerary. Please try again.",
        hotels: [],
        attractions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const parseGeminiResponse = (rawResponse: string): ParsedResponse => {
    try {
      const sections = rawResponse.split(/(Itinerary|Hotels|Attractions):/);
      const itinerary = sections[sections.indexOf("Itinerary") + 1]?.trim() || "No itinerary provided.";
      const hotelsSection = sections[sections.indexOf("Hotels") + 1]?.trim() || "";
      const attractionsSection = sections[sections.indexOf("Attractions") + 1]?.trim() || "";

      let hotels: { name: string; link: string; imageUrl: string }[] = [];
      if (hotelsSection) {
        const hotelEntries = hotelsSection.split("Hotel:").filter((entry) => entry.trim());
        hotels = hotelEntries.map((entry) => {
          const [name, link, imageUrl] = entry.split(",").map((item) => item.trim());
          return {
            name: name || "Unknown Hotel",
            link: link || "#",
            imageUrl: imageUrl || "/images/placeholder.jpg",
          };
        });
      }

      let attractions: { name: string; imageUrl: string }[] = [];
      if (attractionsSection) {
        const attractionEntries = attractionsSection.split("Attraction:").filter((entry) => entry.trim());
        attractions = attractionEntries.map((entry) => {
          const [name, imageUrl] = entry.split(",").map((item) => item.trim());
          return {
            name: name || "Unknown Attraction",
            imageUrl: imageUrl || "/images/placeholder.jpg",
          };
        });
      }

      return { itinerary, hotels, attractions };
    } catch (err) {
      console.error("Error parsing response:", err);
      throw err;
    }
  };

  const formatForSpeech = (response: ParsedResponse): string => {
    let speechText = "Here is your travel itinerary:\n";
    speechText += response.itinerary + "\n";
    if (response.hotels.length > 0) {
      speechText += "\nHotel Recommendations:\n";
      response.hotels.forEach((hotel, index) => {
        speechText += `Hotel ${index + 1}: ${hotel.name}. Booking link: ${hotel.link}.\n`;
      });
    } else {
      speechText += "\nNo hotel recommendations available.\n";
    }
    if (response.attractions.length > 0) {
      speechText += "\nTourist Attractions:\n";
      response.attractions.forEach((attraction, index) => {
        speechText += `Attraction ${index + 1}: ${attraction.name}.\n`;
      });
    } else {
      speechText += "\nNo attractions available.\n";
    }
    return speechText;
  };

  const speakResponse = () => {
    if (!response) return;
    window.speechSynthesis.cancel();
    const speechText = formatForSpeech(response);
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = selectedLang;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value;
    const voice = voices.find((v) => v.name === voiceName) || null;
    setSelectedVoice(voice);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechRate(Number(e.target.value));
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(e.target.value);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 dark:bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <span>Generate Itinerary</span>
            )}
          </button>
          {response && (
            <>
              <button
                onClick={speakResponse}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isSpeaking
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 dark:bg-green-800 text-white hover:bg-green-700 dark:hover:bg-green-700"
                }`}
                disabled={isSpeaking}
                aria-label="Play voice output"
              >
                {isSpeaking ? "Speaking..." : "Play Voice"}
              </button>
              <button
                onClick={stopSpeech}
                className="bg-red-600 dark:bg-red-800 text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
                aria-label="Stop voice output"
              >
                Stop Voice
              </button>
              <select
                onChange={handleLangChange}
                value={selectedLang}
                className="border rounded-lg p-2 bg-white dark:bg-gray-700 dark:text-white"
                aria-label="Select language"
              >
                <option value="en-US">English (US)</option>
                <option value="hi-IN">Hindi (India)</option>
                <option value="th-TH">Thai (Thailand)</option>
              </select>
              <select
                onChange={handleVoiceChange}
                className="border rounded-lg p-2 bg-white dark:bg-gray-700 dark:text-white"
                aria-label="Select voice"
              >
                {voices
                  .filter((voice) => voice.lang === selectedLang)
                  .map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
              </select>
              <div className="flex items-center space-x-2">
                <label htmlFor="speechRate" className="text-gray-700 dark:text-gray-300">
                  Speed:
                </label>
                <input
                  id="speechRate"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={handleRateChange}
                  className="w-32"
                />
                <span className="text-gray-700 dark:text-gray-300">{speechRate.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
        {response && (
          <div className="space-y-8">
            <ItineraryText itinerary={response.itinerary} />
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Hotels
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {response.hotels.length > 0 ? (
                  response.hotels.map((hotel, index) => (
                    <HotelCard
                      key={index}
                      name={hotel.name}
                      link={hotel.link}
                      imageUrl={hotel.imageUrl}
                    />
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No hotel recommendations available.
                  </p>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Attractions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {response.attractions.length > 0 ? (
                  response.attractions.map((attraction, index) => (
                    <AttractionCard
                      key={index}
                      name={attraction.name}
                      imageUrl={attraction.imageUrl}
                    />
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No attractions available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}