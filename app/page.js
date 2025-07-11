//app/page.jsx
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import BroadAncestrySelector from "@/components/MultiSelect"; // Asegúrate de que el nombre coincida
import TraitSelector from "@/components/TraitCategory";
import GoToPrioritizationButton from "@/components/ui/GoToPrioritizationButton";
import CancelButton from "@/components/ui/CancelButton";

export default function Home() {
  const [ancestries, setAncestries] = useState([]); // ✅ Declaración del estado
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
  }, [selectedItems]);

  return (
    <div className="container grid-rows-[auto_1fr_auto] grid-cols-12 min-h-screen p-4 sm:p-8 gap-4 sm:gap-8">

      <header className="col-span-12 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">PHENOTYPE SELECTOR</h1>

      </header>
      <main className="col-span-12 sm:col-span-10 max-w-6xl mx-auto flex flex-col gap-6 sm:gap-10">

        {/*<div className="col-span-12 sm:col-span-6">
          <BroadAncestrySelector onAncestriesChange={setAncestries} />
        </div>*/}
        <div className="col-span-12 sm:col-span-6">
          {/*<TraitSelector onAncestriesChange={setAncestries} />¨*/}
          <TraitSelector selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        </div>
      </main>

      
    </div>
  );
}
