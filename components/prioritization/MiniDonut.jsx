// components/prioritization/MiniDonut.jsx
"use client";

import { PieChart, Pie, Cell } from "recharts";

const ancestryColorMap = {
  AFR: "#fdd835", // African
  AMR: "#ef5350", // Hispanic or Latin American
  ASN: "#6d4c41", // Additional Asian Ancestries
  EAS: "#66bb6a", // East Asian
  EUR: "#42a5f5", // European
  GME: "#00acc1", // Greater Middle Eastern
  MAE: "#f48fb1", // Multi-ancestry (including European)
  MAO: "#f57c00", // Multi-ancestry (excluding European)
  NR: "#bdbdbd", // Not Reported
  OTH: "#9e9e9e", // Additional Diverse Ancestries
  SAS: "#8e24aa", // South Asian

};

export default function MiniDonut({ data, width = 50, height = 50 }) {
  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={14}
        outerRadius={20}
        paddingAngle={0}
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={ancestryColorMap[entry.symbol] || ancestryColorMap.OTHER}
          />
        ))}
      </Pie>
    </PieChart>
  );
}
