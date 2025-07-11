"use client";

import { Select, SelectItem } from "@heroui/react";
import { useState, useEffect } from "react";
import { RefreshCcw, Info } from "lucide-react";
import clsx from "clsx";

export default function BroadAncestrySelector({ onAncestriesChange, setSelectedItems }) {
  const [options, setOptions] = useState([]);
  const [selectedAncestries, setSelectedAncestries] = useState(new Set());

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ancestries`)
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.sort((a, b) => a.label.localeCompare(b.label)));
      })
      .catch((error) => console.error("Error al cargar los datos:", error));
  }, []);

  const handleSelectionChange = (keys) => {
    const ancestryArray = Array.from(keys);
    if (ancestryArray.length <= 4) {
      setSelectedAncestries(new Set(ancestryArray));
      onAncestriesChange?.(ancestryArray);
    }
  };

  const resetSelection = () => {
    const empty = new Set();
    setSelectedAncestries(empty);
    onAncestriesChange?.([]);
    setSelectedItems?.([]);
  };

  return (
    <div className="w-[400px] p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="block text-lg font-bold text-black mb-1">
            Ancestry
            <span className="relative group ml-2 inline-block align-middle">
              <Info size={20} className="text-gray-500 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-black text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none">
                Puedes seleccionar hasta 4 grupos ancestrales.
              </div>
            </span>
          </label>

          <Select
            aria-label="Select ancestry groups"
            placeholder="None"
            className="w-full h-12 truncate bg-gray-600 text-white border border-gray-600 rounded-lg shadow-md"
            selectionMode="multiple"
            selectedKeys={selectedAncestries}
            onSelectionChange={handleSelectionChange}
            listboxProps={{
              className: "bg-gray-600 border border-gray-600 rounded-lg shadow-md text-white max-h-40 overflow-auto",
            }}
          >
            {options.map((item) => (
              <SelectItem
                key={item.symbol}
                textValue={item.label}
                aria-label={item.label}
                className={({ isSelected }) =>
                  clsx(
                    "px-4 py-2 rounded-md transition",
                    isSelected || selectedAncestries.has(item.symbol)
                      ? "bg-red-600 text-white font-semibold"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  )
                }
              >
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <div className="mt-2 text-sm font-semibold text-black truncate">
            <span className="block w-full truncate text-left">SELECTED:</span>
            {selectedAncestries.size > 0
              ? Array.from(selectedAncestries).join(", ")
              : "NONE"}
          </div>
        </div>

        <div className="flex flex-col items-center pt-7">
          <button
            onClick={resetSelection}
            className="bg-orange-400 hover:bg-orange-500 text-white p-3 rounded-full shadow-md transition"
            title="Reset selection"
          >
            <RefreshCcw size={20} />
          </button>
          <span className="text-sm text-black mt-1 font-semibold">Reset</span>
        </div>
      </div>
    </div>
  );
}
