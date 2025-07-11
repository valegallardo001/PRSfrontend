"use client";

import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@heroui/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import MiniDonut from "./MiniDonut";
import { Info } from "lucide-react";

/*const columns = [
  { name: "Model ID", uid: "pgs_id" },
  { name: "Trait", uid: "trait_label" },
  { name: "Ancestry", uid: "ancestry" },
  { name: "N. SNPs", uid: "num_snps" },
  { name: "Development Samples details", uid: "dev_sample" },
  { name: "Evaluation Sample Ancestry", uid: "eval_ancestry" },
  { name: "Reported Trait", uid: "reported_trait" },
  { name: "Risk Association", uid: "risk_assoc" },
  { name: "Discriminatory Power", uid: "discrim_power" },
  { name: "Year of publication", uid: "year" },
  { name: "PubMed ID", uid: "pubmed_id" },
];
*/
const columns = [
  { name: "Model ID", uid: "pgscId" },
  { name: "Trait", uid: "trait_label" },
  { name: "Ancestry", uid: "ancestry" },
  { name: "N SNPs", uid: "num_snps" },
  { name: "N Indiv.", uid: "dev_sample" },
  { name: "Evaluated Ancestry", uid: "eval_ancestry" },
  { name: "Reported Trait", uid: "reported_trait" },
  { name: "Risk Association (OR)", uid: "orScore" },
  { name: "Discriminatory Power (AUC)", uid: "aucScore" },
  { name: "Year", uid: "year" },
  { name: "PMID", uid: "pubmed_id" },
];


export default function PrioritizationTableHTML({ models = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(models);
  const [selectedRows, setSelectedRows] = useState(() =>
    new Set()
    //new Set(models.slice(0, 10).map((item) => item.pgscId))
  );
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);

  console.log(";) Ejemplo modelo:", models[0]);

  useEffect(() => {
    setData(models);
  }, [models]);

  console.log("📊 Modelos recibidos:", models);
  console.log("🔍 Ejemplo modelo:", models[0]);
  const parseAncestryData = (ancestryString) => {
    return ancestryString
      .split(", ")
      .map((entry) => {
        const match = entry.match(/(\w+)\s\(([^)]+)\)\s([\d.]+)%/);
        if (match) {
          const [_, symbol, label, value] = match;
          return {
            name: `${symbol} (${label})`,
            value: parseFloat(value),
          };
        }
        return null;
      })
      .filter(Boolean);
  };
  const handleRunAnalysis = () => {
    const selectedModels = data.filter((model) => selectedRows.has(model.pgscId));

    // Ejemplo: guardarlo en localStorage
    localStorage.setItem("selectedModelsForAnalysis", JSON.stringify(selectedModels));

    // O si usas router:
    // router.push("/analysis");

    // O simplemente mostrarlo por consola
    console.log("🚀 Models ready for analysis:", selectedModels);
  };


  const rowsPerPage = 30;
  const pages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;

  const sortedData = useMemo(() => {
    const sortableKeys = ['trait_label', 'orScore', 'aucScore', 'year'];
    if (!sortConfig.key || !sortableKeys.includes(sortConfig.key)) {
      return data; // se permite el orden manual (drag & drop)
    }

    const sorted = [...data].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'aucScore' || sortConfig.key === 'year') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const displayedData = useMemo(() => {
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = startIndex + result.source.index;
    const destinationIndex = startIndex + result.destination.index;

    const newData = [...data];
    const [movedItem] = newData.splice(sourceIndex, 1);
    newData.splice(destinationIndex, 0, movedItem);
    setData(newData);
  };

  const toggleSelect = (pgscId) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(pgscId) ? newSet.delete(pgscId) : newSet.add(pgscId);
      return newSet;
    });
  };

  const allVisibleSelected = displayedData.every((item) =>
    selectedRows.has(item.pgscId)
  );


  const toggleSelectAllVisible = () => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (allVisibleSelected) {
        displayedData.forEach((item) => newSet.delete(item.pgscId));
      } else {
        displayedData.forEach((item) => newSet.add(item.pgscId));
      }
      return newSet;
    });
  };
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };
  const renderRow = (item) => {
    const cells = [];

    cells.push(
      <td key="checkbox" className="px-4 py-3">
        <input
          type="checkbox"
          aria-label={`Select row ${item.pgscId}`}
          checked={selectedRows.has(item.pgscId)}
          onChange={() => toggleSelect(item.pgscId)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
      </td>
    );

    columns.forEach((col) => {
      cells.push(
        <td key={col.uid} className="px-4 py-3 text-gray-800">
          {/* ...tu lógica condicional... */}
          {col.uid === "pgscId" ? (
            <a
              href={`https://www.pgscatalog.org/score/${item[col.uid]}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {item[col.uid]}
            </a>
          ) : col.uid === "aucScore" ? (
            <span className="font-medium text-green-700">{item[col.uid]}</span>
          ) : col.uid === "orScore" ? (
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
              {item[col.uid]}
            </span>
          ) : col.uid === "pubmed_id" && item[col.uid] !== "—" ? (
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${item[col.uid]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {item[col.uid]}
            </a>
          ) : col.uid === "ancestry" ? (
            <div className="flex items-center gap-2">
              <MiniDonut data={parseAncestryData(item[col.uid])} />
              <button
                onClick={() => {
                  const parsed = parseAncestryData(item[col.uid]);
                  setChartData(parsed);
                  setShowChart(true);
                }}
                className="text-xs text-blue-600 underline"
              >
                View
              </button>
            </div>
          ) : (
            item[col.uid] || "—"
          )}
        </td>
      );
    });

    return cells;
  };



  console.log("🧾 Datos en tabla:", models);

  return (

    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        {/* Título + Info izquierda */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800">PRS Models Prioritization</h2>
          <span className="relative group align-middle inline-block">
            <Info size={20} className="text-gray-500 cursor-pointer" />
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-black text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none">
              Puedes ordenar los modelos por <b>Trait</b>, <b>OR</b>, <b>AUC</b> y <b>Año</b>. Si no hay orden activo, puedes reordenarlos manualmente.
            </div>
          </span>
        </div>

        {/* Reset order + Info derecha */}
        <div className="flex items-center gap-2">
          {sortConfig.key && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortConfig({ key: null, direction: 'asc' })}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset order
              </button>
              <div className="relative ml-2 group inline-block">
                <Info size={18} className="text-gray-500 cursor-pointer" />
                <div
                  className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-black text-white text-sm rounded shadow-lg z-50"
                >
                  El reordenamiento manual solo está disponible cuando no hay orden activo. (DIANA)
                </div>
              </div>

            </div>
          )}

        </div>
      </div>


      <DragDropContext onDragEnd={handleDragEnd}>
        <table className="w-full text-sm text-left rounded-xl overflow-hidden border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-800 text-sm font-semibold">
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-2 border-b border-gray-300"></th>
              <th colSpan={2} className="px-4 py-2 border-b border-gray-300 text-center">Model</th>
              <th colSpan={2} className="px-4 py-2 border-b border-gray-300 text-center">Model Development</th>
              <th colSpan={2} className="px-4 py-2 border-b border-gray-300 text-center">Model Evaluation</th>
              <th colSpan={3} className="px-4 py-2 border-b border-gray-300 text-center">Performance Metrics</th>
              <th colSpan={2} className="px-4 py-2 border-b border-gray-300 text-center">Publication</th>
            </tr>
            <tr>
              <th className="px-4 py-3 border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
              </th>
              {columns.map((col) => {
                const isSortable = ['trait_label', 'orScore', 'aucScore', 'year'].includes(col.uid);
                const isActive = sortConfig.key === col.uid;
                const directionSymbol = isActive ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '';
                return (
                  <th
                    key={col.uid}
                    className={`px-4 py-3 border-b border-gray-200 cursor-pointer select-none
            ${isSortable ? 'underline text-gray-800 hover:text-gray-900' : 'text-gray-700'}
          `}
                    onClick={() => isSortable && handleSort(col.uid)}
                  >
                    {col.name} {directionSymbol}
                  </th>
                );
              })}
            </tr>
          </thead>



          {!sortConfig.key ? (
            // ✅ DRAG AND DROP habilitado
            <Droppable droppableId="pgs-table" direction="vertical">
              {(provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps} className="divide-y divide-gray-300">
                  {displayedData.map((item, index) => (
                    <Draggable key={item.pgscId} draggableId={item.pgscId} index={index}>
                      {(dragProvided) => (
                        <tr
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className="even:bg-gray-100 hover:bg-gray-110 transition"
                        >
                          {renderRow(item)}
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          ) : (
            //  ORDENAMIENTO ACTIVADO → sin drag & drop
            <tbody className="divide-y divide-gray-200">
              {displayedData.map((item) => (
                <tr key={item.pgscId} className="even:bg-gray-100 hover:bg-gray-100 transition">
                  {renderRow(item)}
                </tr>
              ))}
            </tbody>
          )}

        </table>
      </DragDropContext>

      <div className="flex justify-between items-center mt-5">
        <span className="text-sm text-gray-500">
          Showing {displayedData.length} of {data.length} results
        </span>
        <div className="flex-1 flex justify-center">


        </div>
      </div>


      <div className="mt-2 text-sm text-gray-600">
        {selectedRows.size > 0
          ? `${selectedRows.size} model(s) selected`
          : "No models selected"}
      </div>

      {/* ⬇ Agrega aquí el botón */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleRunAnalysis}
          disabled={selectedRows.size === 0 || selectedRows.size > 10}
          className={`px-4 py-2 rounded text-white transition ${selectedRows.size === 0 || selectedRows.size > 10
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-blue-700"
            }`}
        >
          Run Analysis
        </button>
      </div>

      {showChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Ancestry Distribution</h2>
            <PieChart width={600} height={400}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                labelLine={true}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF4"][index % 5]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>

            <button
              onClick={() => setShowChart(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );

}

