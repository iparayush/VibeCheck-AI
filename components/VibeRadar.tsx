import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { VibeMetrics } from '../types';

interface VibeRadarProps {
  metrics: VibeMetrics;
}

export const VibeRadar: React.FC<VibeRadarProps> = ({ metrics }) => {
  const data = [
    { subject: 'Energy', A: metrics.energy, fullMark: 100 },
    { subject: 'Valence', A: metrics.valence, fullMark: 100 },
    { subject: 'Dance', A: metrics.danceability, fullMark: 100 },
    { subject: 'Calm', A: metrics.calmness, fullMark: 100 },
    { subject: 'Intensity', A: metrics.intensity, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 sm:h-80 bg-slate-800/50 rounded-2xl p-4 border border-slate-700 backdrop-blur-sm">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">
        Vibe Signature
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Vibe"
            dataKey="A"
            stroke="#c084fc"
            strokeWidth={3}
            fill="#a855f7"
            fillOpacity={0.4}
          />
          <Tooltip 
             contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
             itemStyle={{ color: '#c084fc' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};