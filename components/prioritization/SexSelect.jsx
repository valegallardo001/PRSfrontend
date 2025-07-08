// components/prioritization/SexSelect.jsx
"use client";

import { Select, SelectItem } from "@heroui/react";

export default function SexSelect({ value, onChange }) {
    return (
        <div>
            <Select
                placeholder="Select Sex"
                selectedKeys={new Set([String(value)])}
                onSelectionChange={(keys) => onChange(Number(Array.from(keys)[0]))}
                className="max-w-[90%]"
                classNames={{
                    trigger:
                        "border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                    popover:
                        "bg-white border border-gray-300 shadow-lg rounded-md z-50 mt-2",
                    listbox:
                        "max-h-60 overflow-y-auto text-sm text-gray-900 bg-white",
                }}
            >
                {["Male", "Female"].map((sex) => (
                    <SelectItem key={sex}>{sex}</SelectItem>
                ))}
            </Select>

        </div>
    );
}