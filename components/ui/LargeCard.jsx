// components/ui/LargeCard.jsx
import React from "react";

export default function LargeCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="text-base text-gray-700 max-h-72 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
