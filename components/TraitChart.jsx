"use client";
// components/TraitChart.js
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const colors = ["#8e44ad", "#2980b9", "#2ecc71", "#e74c3c", "#f1c40f", "#d35400"];

export default function TraitChart({ data }) {
  console.log("Recibiendo datos en TraitChart:", data); //
   if (!data || data.length === 0) {
    return <p className="text-center text-sm text-gray-500">No hay datos para mostrar</p>;
  }
  return (
    <div style={{ width: 300, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            stroke="none"
            paddingAngle={1}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


