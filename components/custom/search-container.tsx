"use client";

import { ReactNode } from "react";

interface SearchContainerProps {
  children: ReactNode;
  className?: string;
}

export function SearchContainer({ children, className = "" }: SearchContainerProps) {
  return (
    <div className="-mt-24 mb-12 relative z-20">
      <div className={`bg-white rounded-xl shadow-xl p-6 border border-gray-100 ${className}`}>
        {children}
      </div>
    </div>
  );
}
