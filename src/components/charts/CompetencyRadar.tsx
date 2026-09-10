import React, { useState } from 'react';
import { Competency } from '../../types';

interface CompetencyRadarProps {
  competencies: Competency[];
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ competencies }) => {
  // Select top key competencies across statistical, technical, and governance for clean radar presentation
  const selected = competencies.slice(0, 8);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 380;
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (Math.PI * 2) / selected.length;

  // Calculate coordinates
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate target polygon path
  const targetPoints = selected.map((c, i) => {
    const { x, y } = getCoordinates(c.targetScore, i);
    return `${x},${y}`;
  }).join(' ');

  // Generate current score polygon path
  const currentPoints = selected.map((c, i) => {
    const { x, y } = getCoordinates(c.currentScore, i);
    return `${x},${y}`;
  }).join(' ');

  // Grid concentric rings (20%, 40%, 60%, 80%, 100%)
  const rings = [20, 40, 60, 80, 100];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-full max-w-[390px] aspect-square flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible"
        >
          {/* Background Concentric Rings */}
          {rings.map((level) => {
            const r = (level / 100) * radius;
            return (
              <g key={`ring-${level}`}>
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeDasharray={level === 100 ? 'none' : '3 3'}
                  strokeWidth={level === 100 ? '1.5' : '1'}
                />
                <text
                  x={center + 4}
                  y={center - r + 11}
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="600"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Axis Spoke Lines */}
          {selected.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}

          {/* Target Score Area (Dashed Amber) */}
          <polygon
            points={targetPoints}
            fill="rgba(245, 158, 11, 0.08)"
            stroke="#f59e0b"
            strokeWidth="1.75"
            strokeDasharray="4 3"
          />

          {/* Current Score Area (Blue Filled) */}
          <polygon
            points={currentPoints}
            fill="rgba(59, 130, 246, 0.25)"
            stroke="#2563eb"
            strokeWidth="2.5"
          />

          {/* Current Score Data Dots & Labels */}
          {selected.map((c, i) => {
            const { x, y } = getCoordinates(c.currentScore, i);
            const { x: tx, y: ty } = getCoordinates(c.targetScore, i);
            const angle = i * angleStep - Math.PI / 2;
            const labelR = radius + 24;
            const lx = center + labelR * Math.cos(angle);
            const ly = center + labelR * Math.sin(angle);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={`node-${c.id}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Target Marker Dot */}
                <circle
                  cx={tx}
                  cy={ty}
                  r="3.5"
                  fill="#f59e0b"
                  stroke="#fff"
                  strokeWidth="1"
                />

                {/* Current Score Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? '6' : '4.5'}
                  fill="#2563eb"
                  stroke="#fff"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* Label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[10px] font-semibold transition-colors ${
                    isHovered ? 'fill-blue-700 font-bold' : 'fill-slate-700'
                  }`}
                >
                  {c.name}
                </text>
                <text
                  x={lx}
                  y={ly + 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[9px] fill-slate-400 font-medium"
                >
                  {c.currentScore}% / {c.targetScore}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-blue-600 border border-blue-700 inline-block"></span>
          <span className="text-slate-700 font-medium">Current Proficiency</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 border-t-2 border-dashed border-amber-500 inline-block"></span>
          <span className="text-slate-700 font-medium">Target Benchmark</span>
        </div>
      </div>
    </div>
  );
};
