import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface IncidentChartProps {
  data: Array<{ date: string; incidents: number; resolved: number }>;
}

export function IncidentChart({ data }: IncidentChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Incident Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="incidents"
              stackId="1"
              stroke="#ef4444"
              fill="#fef2f2"
              strokeWidth={2}
              name="New Incidents"
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stackId="2"
              stroke="#10b981"
              fill="#f0fdf4"
              strokeWidth={2}
              name="Resolved"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}