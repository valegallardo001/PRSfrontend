"use client";

import { useState } from "react";
import clsx from "clsx";

export default function CustomToggleButton({
  label,
  tag,
  onToggle,
  color = "#000",
  isActive,
  showCheckbox = false,
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onToggle) onToggle(e);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "w-full flex items-center justify-between px-4 py-2 rounded-lg border transition-all shadow-sm",
        showCheckbox
          ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          : isActive
            ? "bg-blue-100 text-blue-800 border-blue-400"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
      )}
    >
      {/* Punto o Checkbox + texto */}
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-3 overflow-hidden w-full">
          {showCheckbox ? (
            <div className="w-4 h-4 flex items-center justify-center border-2 rounded border-gray-400 bg-white shrink-0">
              {isActive && (
                <span className="text-green-600 font-bold text-sm">✓</span>
              )}
            </div>
          ) : (
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
          )}

          {/* Label con ancho fijo y alineado a la izquierda */}
          <span className="text-sm text-left break-words w-full">
            {label}
          </span>
        </div>
      </div>


      {/* Cantidad (número a la derecha) */}
      {tag !== undefined && (
        <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 min-w-[32px] text-center">
          {tag}
        </span>
      )}
    </button>
  );
}
