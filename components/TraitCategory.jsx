"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import Trait from "./Trait";
import CustomToggleButton from "@/components/ui/CustomToggleButton";
import TraitChart from "./TraitChart";
import LargeCard from "@/components/ui/LargeCard";
import BroadAncestrySelector from "@/components/MultiSelect";
import GoToPrioritizationButton from "@/components/ui/GoToPrioritizationButton";
import CancelButton from "@/components/ui/CancelButton";

const colors = [
  "#8e44ad", "#2980b9", "#2ecc71", "#e74c3c", "#f1c40f",
  "#d35400", "#1abc9c", "#34495e", "#7f8c8d", "#9b59b6",
  "#27ae60", "#c0392b", "#16a085", "#f39c12", "#e67e22",
  "#2c3e50", "#bdc3c7", "#95a5a6", "#e84393", "#fdcb6e"
];

export default function TraitSelector({ onAncestriesChange, selectedItems, setSelectedItems }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [traits, setTraits] = useState({});
  const [selectedAncestries, setSelectedAncestries] = useState([]);

  useEffect(() => {
    const fetchGroupedData = async () => {
      try {
        const query = selectedAncestries.length
          ? `?ancestries=${selectedAncestries.join(",")}`
          : "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trait-categories/grouped${query}`);
        const data = await res.json();

        const traitMap = {};
        const preparedCategories = data.map((cat, index) => {
          cat.traits.forEach((trait) => {
            traitMap[trait.id] = {
              id: trait.id,
              name: trait.label,
              pgss: trait.prsCount,
              description: trait.description,
              URL: trait.URL,
              onto_id:
                trait.efoId ||
                trait.mondoId ||
                trait.hpoId ||
                trait.orphaId ||
                trait.hpoId ||
                "N/A",
            };
            console.log("📦 Datos crudos desde backend:", data);

          });


          return {
            ...cat,
            id: cat.label,
            color: colors[index % colors.length],
            pgss: cat.totalPrs,
            name: cat.label,
            traits: [...new Set(cat.traits.map((t) => t.id))]   // 👈 evita duplicados
          };

        });

        setCategories(preparedCategories);
        setTraits(traitMap);
      } catch (error) {
        console.error("❌ Error cargando datos agrupados:", error);
      }
    };

    fetchGroupedData();
  }, [selectedAncestries]);

  const isItemSelected = (id, type) =>
    selectedItems.some((item) => item.id === id && item.type === type);

  const handleCategoryToggle = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);

    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    setSelectedItems((prev) => {
      const withoutCategory = prev.filter((item) => item.type !== "category");

      if (isItemSelected(categoryId, "category")) {
        return withoutCategory;
      } else {
        return [
          ...withoutCategory,
          { id: category.id, name: category.name, type: "category" },
        ];
      }
    });
  };

  const handleTraitToggle = (trait) => {
    if (isItemSelected(trait.id, "trait")) {
      setSelectedItems((prev) =>
        prev.filter((item) => !(item.id === trait.id && item.type === "trait"))
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          id: trait.id,
          name: trait.name,
          type: "trait",
          onto_id: trait.onto_id,
        },
      ]);
    }
  };

  const chartData = useMemo(() => {
    return categories.map((cat, index) => ({
      name: cat.name,
      value: cat.pgss,
      color: cat.color || colors[index % colors.length],
    }));
  }, [categories]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full max-w-xl">
        <BroadAncestrySelector
          onAncestriesChange={(selected) => {
            setSelectedAncestries(selected);
            setSelectedItems((prev) => [
              ...prev.filter((item) => item.type !== "ancestry"),
              ...selected.map((symbol) => ({
                id: symbol,
                name: symbol,
                type: "ancestry",
              })),
            ]);
            if (onAncestriesChange) onAncestriesChange(selected);
          }}
          setSelectedItems={setSelectedItems}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="flex flex-col items-center justify-center min-h-[240px] md:min-h-[300px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Trait Category Distribution
          </h3>
          <TraitChart data={chartData} />
        </div>

        <Card>
          <h2 className="text-base font-bold mb-4 text-gray-800">Trait Category</h2>
          <div className="max-h-[320px] overflow-y-auto pr-2 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <CustomToggleButton
                  label={category.name}
                  tag={category.pgss}
                  color={category.color}
                  isActive={isItemSelected(category.id, "category")}
                  onToggle={() => handleCategoryToggle(category.id)}
                  className="text-sm whitespace-normal break-words w-full text-left"
                />
              </div>
            ))}
          </div>
        </Card>

        {selectedCategory && (
          <Trait
            traits={categories
              .find((c) => c.id === selectedCategory)
              ?.traits?.map((id) => traits[id])
              .filter(Boolean)}
            selectedItems={selectedItems}
            onTraitClick={handleTraitToggle}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="md:col-span-3">
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
            <LargeCard title="Selected Trait">
              {selectedItems.filter((item) => item.type === "trait").length === 0 ? (
                <p className="text-sm text-gray-500">None</p>
              ) : (
                <>
                  <ul className="max-h-48 overflow-y-auto pr-2 space-y-2">
                    {selectedItems
                      .filter((item) => item.type === "trait")
                      .map((item) => (
                        <li
                          key={`trait-${item.id}`}
                          className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md shadow-sm"
                        >
                          <span className="text-sm">🧬 {item.name}</span>
                          <button
                            onClick={() =>
                              setSelectedItems((prev) =>
                                prev.filter(
                                  (i) => !(i.id === item.id && i.type === "trait")
                                )
                              )
                            }
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            REMOVE
                          </button>
                        </li>
                      ))}
                  </ul>

                  <hr className="my-4 border-gray-300" />

                  <div className="text-right text-sm font-semibold text-gray-700">
                    Total models:{" "}
                    {selectedItems
                      .filter((item) => item.type === "trait")
                      .reduce((acc, item) => acc + (traits[item.id]?.pgss || 0), 0)}
                  </div>
                </>
              )}
            </LargeCard>

            {/* Botones alineados al lado derecho del recuadro */}
            <div className="flex flex-row gap-6 justify-end mt-4">
              <CancelButton />
              <GoToPrioritizationButton selectedItems={selectedItems} />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
