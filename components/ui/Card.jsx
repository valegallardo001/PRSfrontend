"use client";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded-lg w-full sm:w-96 md:w-[450px] lg:w-[300px] h-auto p-6${className}`}>
      {children}
    </div>
  );
}
