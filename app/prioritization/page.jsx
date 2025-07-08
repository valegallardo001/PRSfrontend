//app/prioritization/page.jsx
"use client";

import { useState, useEffect } from "react";
import MainAncestrySelect from "@/components/prioritization/MainAncestrySelect";
import { Button } from "@/components/ui/Button";
import PrioritizationTableHTML from "@/components/prioritization/TableHTML";

export default function PrioritizationPage() {
  const [ancestry, setAncestry] = useState([]);
  const [traits, setTraits] = useState([]);
  const [symbolsFromURL, setSymbolsFromURL] = useState([]);

  const [mainAncestry, setMainAncestry] = useState("");
  const [ancestryOptions, setAncestryOptions] = useState([]);
  const [ancestryMap, setAncestryMap] = useState([]); // NUEVO: mantiene symbol-label pareado

  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  // Cargar ancestría y traits desde la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ancestryParam = searchParams.get("ancestries");
    const traitsParam = searchParams.get("traits");

    const symbols = ancestryParam ? ancestryParam.split(",") : [];
    setAncestry(symbols);
    setSymbolsFromURL(symbols);
    setTraits(traitsParam ? traitsParam.split(",") : []);

    // Agrega esto para que selectedItems tenga los traits
    const traitItemsFromURL = traitsParam
      ? traitsParam.split(",").map((id) => ({
        id,
        type: "trait",
        name: "",
        onto_id: id,
      }))
      : [];

    setSelectedItems(traitItemsFromURL);
  }, []);


  console.log("Traits en la URL:", traits);
  console.log("Ancestries en la URL:", ancestry);

  // Cargar labels y mapear symbol-label desde el backend
  useEffect(() => {
    if (symbolsFromURL.length === 0) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ancestries`)
      .then((res) => res.json())
      .then((data) => {
        const matched = data.filter((a) => symbolsFromURL.includes(a.symbol));
        const matchedLabels = matched.map((a) => a.label);
        setAncestryOptions(matchedLabels);
        setAncestryMap(matched); // Guarda symbol y label pareados
        setMainAncestry(matchedLabels[0] || "");
        console.log("Opciones de ancestría cargadas:", matchedLabels);
      })
      .catch((err) => console.error("Error al cargar ancestrías:", err));
  }, [symbolsFromURL]);


  const handleSubmit = async () => {
    try {
      // Extraer solo los items de tipo trait
      const selectedTraits = selectedItems.filter(item => item.type === "trait");

      // Mapear a los IDs estandarizados (onto_id)
      const selectedTraitIds = selectedItems
        .filter(item => item.type === "trait")
        .map(item => item.onto_id)
        .filter(Boolean);

      const ancestrySymbol = ancestryMap.find(
        (a) => a.label === mainAncestry
      )?.symbol;

      console.log("🧬 selectedTraitIds:", selectedTraitIds);
      console.log("🌍 ancestrySymbol:", ancestrySymbol);

      if (!selectedTraitIds.length || !ancestrySymbol) {
        console.error("Traits o ancestría no válidas.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/prioritization/prioritize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedTraitIds,
            mainAncestrySymbol: ancestrySymbol,
          }),
        }
      );

      if (!response.ok) throw new Error("Error en la priorización");

      const data = await response.json();

      const transformed = data.map((model) => ({
        pgscId: model.pgscId,
        trait_label: model.name,
        ancestry: model.ancestry,
        num_snps: model.num_snps,
        dev_sample: model.dev_sample,
        eval_ancestry: model.eval_ancestry,
        reported_trait: model.reported_trait,
        orScore: model.orScore?.toString() || "—",
        aucScore: model.aucScore?.toString() || "—",
        year: model.year,
        pubmed_id: model.pubmed_id,
      }));


      setResults(transformed);
    } catch (err) {
      console.error("Falló la priorización:", err);
    }
  };


  return (
    <div className="p-10 space-y-8">
      <h1 className="text-4xl font-bold text-black">PRIORITIZATION MODULE</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div>
          <label className="font-semibold mb-1 block">Main Ancestry:</label>
          <MainAncestrySelect
            value={mainAncestry}
            onChange={setMainAncestry}
            options={ancestryOptions}
          />
        </div>
        <Button onClick={handleSubmit} className="mt-1 sm:mt-0">
          Run Prioritization
        </Button>
      </div>


      {results.length > 0 && (
        <div className="space-y-6">
          <PrioritizationTableHTML models={results} />
        </div>
      )}
    </div>
  );
}
