"use client";

import { useState, useEffect } from "react";
import MainAncestrySelect from "@/components/prioritization/MainAncestrySelect";
import { Button } from "@/components/ui/Button";
import PrioritizationTableHTML from "@/components/prioritization/TableHTML";

export default function PrioritizationPage() {
  const [ancestry, setAncestry] = useState([]);
  const [traits, setTraits] = useState([]);
  const [symbolsFromURL, setSymbolsFromURL] = useState([]);

  const [mainAncestry, setMainAncestry] = useState(null);
  const [ancestryOptions, setAncestryOptions] = useState([]);
  const [ancestryMap, setAncestryMap] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener traits y ancestrías desde la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ancestryParam = searchParams.get("ancestries");
    const traitsParam = searchParams.get("traits");

    const symbols = ancestryParam ? ancestryParam.split(",") : [];
    setAncestry(symbols);
    setSymbolsFromURL(symbols);
    setTraits(traitsParam ? traitsParam.split(",") : []);

    const traitItemsFromURL = traitsParam
      ? traitsParam.split(",").map((id) => ({
        id,
        type: "trait",
        name: "",
        label: "",
        onto_id: id,
      }))
      : [];
    console.log("🧬 traitItemsFromURL:", traitItemsFromURL);

    setSelectedItems(traitItemsFromURL);
  }, []);

  // Obtener listado de ancestrías
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ancestries`)
      .then((res) => res.json())
      .then((data) => {
        if (symbolsFromURL.length > 0) {
          const matched = data.filter((a) => symbolsFromURL.includes(a.symbol));
          const matchedLabels = matched.map((a) => a.label);
          setAncestryOptions(matchedLabels);
          setAncestryMap(matched);
          setMainAncestry(matchedLabels[0] || "");
        } else {
          const allLabels = data.map((a) => a.label);
          setAncestryOptions(allLabels);
          setAncestryMap(data);
          setMainAncestry(allLabels[0] || "");
        }
      })
      .catch((err) => console.error("Error al cargar ancestrías:", err));
  }, [symbolsFromURL]);

  // Enriquecer los traits con label y name después de cargarlos desde la URL
  useEffect(() => {
    if (traits.length > 0) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/traits/by-ids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: traits }),
      })
        .then((res) => res.json())
        .then((fetchedTraits) => {
          const enriched = traits.map((id) => {
            const match = fetchedTraits.find((t) => t.id.toString() === id);
            return {
              id,
              type: "trait",
              name: match?.description || "",
              label: match?.label || "",
              onto_id: id,
            };
          });
          setSelectedItems(enriched);
        })
        .catch((err) => console.error("Error al enriquecer traits:", err));
    }
  }, [traits]);


  const handleSubmit = async () => {
    try {
      setLoading(true);
      setHasSearched(false);
      setResults([]); // limpiar resultados anteriores si deseas

      const selectedTraitIds = selectedItems
        .filter(item => item.type === "trait")
        .map(item => item.onto_id)
        .filter(Boolean);

      const ancestrySymbol = ancestryMap.find(
        (a) => a.label === mainAncestry
      )?.symbol;

      // Si no hay ancestría seleccionada pero sí traits, sugerir ancestrías desde backend
      if (!ancestrySymbol && selectedTraitIds.length > 0) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/prioritization/suggest-ancestries`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedTraitIds }),
          }
        );

        if (!res.ok) throw new Error("Error al sugerir ancestrías");

        const ancestrySuggestions = await res.json();
        setAncestryOptions(ancestrySuggestions.map(a => a.label));
        setAncestryMap(ancestrySuggestions);
        return; // Salimos porque aún no se selecciona una ancestría
      }

      if (!selectedTraitIds.length || !ancestrySymbol) {
        console.error("Traits o ancestría no válidas.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/prioritization/prioritize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedTraitIds, mainAncestrySymbol: ancestrySymbol }),
        }
      );

      if (!response.ok) throw new Error("Error en la priorización");
      const data = await response.json();

      // ⚠️ No se encontró ningún modelo
      if (data.length === 0) {
        const selectedTrait = selectedItems.find(item => item.type === "trait");
        const traitLabel = selectedTrait?.label || selectedTrait?.name || "this trait";
        const ancestryLabel = mainAncestry || "this ancestry";

        setErrorMessage(`No validated ${traitLabel} models found for ${ancestryLabel} ancestry.`);
        setResults([]);
        return;
      }

      // ⚠️ Algunos modelos no cumplen con la condición de evaluación OR + AUC/C-index
      const invalidModels = data.filter(model => {
        return model.or == null || (model.auroc == null && model.c_index == null);
      });

      if (invalidModels.length > 0) {
        setErrorMessage(`Warning: ${invalidModels.length} model(s) do not meet the minimum evaluation criteria (OR and AUC or C-index). They may not be reliable.`);
      } else {
        setErrorMessage(""); // Limpiar si todo está bien
      }


      const transformed = data.map((model) => ({
        modelId: model.modelId || model.id,
        pgscId: model.pgscId,
        trait_label: model.name,
        ancestry: model.ancestry,
        num_snps: model.num_snps,
        dev_sample: model.dev_sample,
        eval_ancestry: model.eval_ancestry,
        reported_trait: model.reported_trait,
        or: model.or === "—" ? null : parseFloat(model.or),
        auroc: model.auroc === "—" ? null : parseFloat(model.auroc),
        year: model.year,
        pubmed_id: model.pubmed_id,
      }));

      setResults(transformed);
    } catch (err) {
      console.error("Falló la priorización:", err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };



  return (
    <div className="p-10 space-y-8">
      <h1 className="text-4xl font-bold text-black">PRIORITIZATION MODULE</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div>
          <MainAncestrySelect
            value={mainAncestry}
            onChange={setMainAncestry}
            options={ancestryOptions}
          />
        </div>
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-blue-700">
          Run Prioritization
        </Button>
      </div>

      {loading && (
        <p className="text-gray-600 font-medium">Loading models...</p>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <p className="text-red-600 font-semibold">
          {errorMessage || "No models were found for the selected traits and ancestry."}
        </p>
      )}


      {!loading && results.length > 0 && (
        <div className="space-y-6">
          <PrioritizationTableHTML models={results} />
        </div>
      )}
    </div>
  );
}
