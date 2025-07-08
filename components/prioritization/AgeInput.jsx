"use client";

import { useState } from "react";

export default function AgeSelect({ value, onChange }) {
    const [inputValue, setInputValue] = useState(value);
    const [showOptions, setShowOptions] = useState(false);

    const ages = Array.from({ length: 101 }, (_, i) => i); // 0 a 100

    const filteredAges = ages.filter((age) =>
        age.toString().startsWith(inputValue.toString())
    );

    const handleSelect = (val) => {
        setInputValue(val);
        onChange(val);
        setShowOptions(false);
    };

    return (
        <div className="relative w-full max-w-[90%] mx-auto">
            <input
                type="number"
                min={0}
                max={100}
                value={inputValue}
                onChange={(e) => {
                    const val = e.target.value;
                    setInputValue(val);
                    onChange(val);
                    setShowOptions(true);
                }}
                placeholder="Enter or select age"
                onFocus={() => setShowOptions(true)}
                onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {showOptions && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg text-sm text-gray-800">
                    {filteredAges.map((age) => (
                        <li
                            key={age}
                            onClick={() => handleSelect(age)}
                            className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                        >
                            {age}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
