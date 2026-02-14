import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#e5e7eb] rounded-xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}
