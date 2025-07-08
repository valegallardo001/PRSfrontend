"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import CustomToggleButton from "@/components/ui/CustomToggleButton";
import * as HoverCard from "@radix-ui/react-hover-card";

export default function Trait({ traits, onTraitClick, selectedItems }) {
  const [selectedTrait, setSelectedTrait] = useState(null);

  const handleTraitSelect = (trait) => {
    setSelectedTrait(trait.id);
    if (onTraitClick) {
      onTraitClick({
        id: trait.id,
        name: trait.name,
        type: "trait",
      });
    }
  };


  

  const isTraitSelected = (id) =>
    selectedItems?.some((item) => item.id === id && item.type === "trait");

  return (
    <div className="flex space-x-4">
      <Card>
        <h2 className="text-lg font-bold mb-2">Trait</h2>

        {/* Scroll aplicado aquí correctamente */}
        <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
          {traits.map((trait) => {
            const isSelected = isTraitSelected(trait.id);

            return (
              <HoverCard.Root key={trait.id} openDelay={150} closeDelay={150}>
                <HoverCard.Trigger asChild>
                  <div
                    className={`cursor-pointer ${isSelected ? "bg-blue-100 rounded-md" : ""}`}
                    onClick={() => handleTraitSelect(trait)}
                  >
                    <CustomToggleButton
                      label={trait.name}
                      tag={trait.pgss}
                      isActive={isTraitSelected(trait.id)}
                      showCheckbox={true} // Esto muestra el checkbox solo en los traits
                      onToggle={(e) => {
                        e.stopPropagation();
                        handleTraitSelect(trait);
                      }}
                    />

                  </div>
                </HoverCard.Trigger>

                <HoverCard.Content
                  side="right"
                  className="rounded-xl bg-white shadow-lg p-4 w-64 border border-gray-200 z-50"
                >
                  <div className="font-bold text-base mb-1">{trait.name}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    ID:{" "}
                    <a
                      href={trait.URL || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {trait.onto_id || "N/A"}
                    </a>
                  </div>
                  <div className="text-sm text-gray-600">
                    Description: {trait.description || "No description available"}
                  </div>
                </HoverCard.Content>
              </HoverCard.Root>
            );
          })}
        </div>
      </Card>

    </div>
  );
}
