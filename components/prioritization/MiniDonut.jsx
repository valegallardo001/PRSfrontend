// components/prioritization/MiniDonut.jsx
"use client";

import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF4"];

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
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
