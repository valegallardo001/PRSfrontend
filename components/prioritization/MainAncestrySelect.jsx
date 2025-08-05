"use client";

import { Select, SelectItem } from "@heroui/react";

export default function MainAncestrySelect({ value, onChange, options }) {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      {/* Etiqueta con asterisco rojo */}
      <label className="text-lg font-semibold text-gray-800">
        Main Ancestry <span className="text-red-500">*</span>
      </label>
      {/* Selector de ancestría */}
      <Select
        aria-label="Main Ancestry"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => onChange(Array.from(keys)[0])}
        className="w-80 truncate bg-gray-800 text-white border border-gray-600 rounded-lg shadow-md"
        placeholder="Choose one Ancestry"
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
              `px-4 py-2 cursor-pointer rounded-md transition font-medium ${isSelected
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
    </div>
  );
}
