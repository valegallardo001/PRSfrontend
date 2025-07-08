"use client";
import { Select, SelectItem } from "@heroui/react";

import { ChevronDown } from "lucide-react";


export default function MainAncestrySelect({ value, onChange, options }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Select
        aria-label="Main Ancestry"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => onChange(Array.from(keys)[0])}
        className="w-80 truncate bg-gray-800 text-white border border-gray-600 rounded-lg shadow-md"
        placeholder="Select Main Ancestry"
        listboxProps={{
          className:
            "bg-gray-600 border border-gray-600 rounded-lg shadow-md text-white max-h-60 overflow-auto",
        }}
        classNames={{
          trigger:
            "bg-gray-600 text-white border border-gray-600 rounded-lg shadow px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
          popover:
            "bg-gray-600 border border-gray-600 rounded-md shadow-lg mt-2 z-50",
          listbox:
            "bg-gray-800 text-white text-sm max-h-60 overflow-y-auto",
        }}
      >
        {options.map((ancestry) => (
          <SelectItem
            key={ancestry}
            textValue={ancestry}
            className={({ isSelected, isFocused }) =>
              `px-4 py-2 cursor-pointer rounded-md transition font-medium ${
                isSelected
                  ? "bg-red-600 text-white"
                  : isFocused
                  ? "bg-gray-700"
                  : "hover:bg-gray-600"
              }`
            }
          >
            {ancestry}
          </SelectItem>
        ))}
      </Select>
      {/* Ícono personalizado 
      <ChevronDown
        size={20}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
      />*/}
    </div>
  );
}
