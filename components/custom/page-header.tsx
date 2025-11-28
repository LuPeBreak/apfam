"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  height?: string; // Tailwind height class, e.g., "h-[300px]"
}

export function PageHeader({
  title,
  description,
  imageSrc,
  imageAlt = "Header background",
  height = "h-[300px]",
}: PageHeaderProps) {
  return (
    <div className={`relative ${height} w-full overflow-hidden`}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
