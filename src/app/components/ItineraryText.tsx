interface ItineraryTextProps {
  itinerary: string;
}

export default function ItineraryText({ itinerary }: ItineraryTextProps) {
  const lines = itinerary.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Itinerary
      </h2>
      <div className="space-y-2 text-gray-700 dark:text-gray-300">
        {lines.map((line, index) => {
          if (line.includes("**")) {
            const boldText = line.replace(/\*\*/g, "").trim();
            return (
              <h3
                key={index}
                className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-4"
              >
                {boldText}
              </h3>
            );
          }
          if (line.trim().startsWith("*")) {
            const bulletText = line.replace(/^\*\s*/, "").trim();
            return (
              <p key={index} className="ml-4 flex items-start">
                <span className="mr-2">•</span>
                {bulletText}
              </p>
            );
          }
          return <p key={index}>{line}</p>;
        })}
      </div>
    </div>
  );
}