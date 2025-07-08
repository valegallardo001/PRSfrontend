// GoToPrioritizationButton.jsx
"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


export default function GoToPrioritizationButton({ selectedItems = [] }) {
  const router = useRouter();

  /*  const handleClick = () => {
      console.log("Ancestrías seleccionadas:", selectedAncestries); // 🔍
      const query = selectedAncestries.join(",");
      router.push(`/prioritization?ancestries=${encodeURIComponent(query)}`);
    };
  */
  console.log("🧬 selectedItems:", selectedItems);

  const handleClick = () => {
    const selectedTraits = selectedItems
      .filter((item) => item.type === "trait")
      .map((item) => item.id);

    const ancestries = selectedItems
      .filter((item) => item.type === "ancestry")
      .map((item) => item.id); // ✅ usa .id en lugar de .symbol

    console.log("✅ Traits seleccionados:", selectedTraits);
    console.log("✅ Ancestrías seleccionadas:", ancestries);

    const traitsParam = selectedTraits.join(",");
    const ancestryParam = ancestries.join(",");
    console.log("Ancestries:", ancestryParam);
    console.log("Traits:", traitsParam);


    router.push(`/prioritization?traits=${traitsParam}&ancestries=${ancestryParam}`);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className="w-10 h-10 rounded-full bg-green-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition duration-200"
        title="Go to Prioritization"
      >
        <ArrowRight size={28} />
      </button>
      <span className="text-sm font-medium text-black text-center">
        Go to Prioritization
      </span>
    </div>
  );
}
