// src/app/components/HotelCard.tsx
import Image from "next/image";

interface HotelCardProps {
  name: string;
  link: string;
  imageUrl: string;
}

export default function HotelCard({ name, link, imageUrl }: HotelCardProps) {
  const safeImageUrl =
    imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/"))
      ? imageUrl
      : "/images/placeholder.jpg";

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative w-full h-48">
        <Image
          src={safeImageUrl}
          alt={name || "Hotel image"}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="text-lg font-semibold mt-3 text-gray-800 dark:text-gray-100">
        {name}
      </h3>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
      >
        Book Now
      </a>
    </div>
  );
}