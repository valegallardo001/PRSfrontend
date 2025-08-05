// app/analysis/results/page.jsx
'use client';
import { useEffect, useState } from 'react';

export default function AnalysisResultsPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prioritization/results`);
        if (!res.ok) throw new Error("Error al cargar los resultados");
        const data = await res.json();
        setModels(data);
      } catch (error) {
        console.error("❌ Error al obtener resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modelos Priorizados</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Modelo ID</th>
            <th className="border p-2">Análisis ID</th>
            <th className="border p-2">Posición</th>
            <th className="border p-2">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={`${model.prsModelId}-${model.prsAnalysisId}`}>
              <td className="border p-2">{model.prsModelId}</td>
              <td className="border p-2">{model.prsAnalysisId}</td>
              <td className="border p-2">{model.position}</td>
              <td className="border p-2">{model.prsResultId || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
