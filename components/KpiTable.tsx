import React from 'react';

export interface KpiRow {
  kpi: string;
  low: string;
  median: string;
  high: string;
  position: string;
}

interface KpiTableProps {
  title: string;
  rows: KpiRow[];
}

export const KpiTable: React.FC<KpiTableProps> = ({ title, rows }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 bg-gray-50 p-3 rounded">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 font-semibold text-gray-700">KPI</th>
              <th className="text-left p-3 font-semibold text-gray-700">Low Range</th>
              <th className="text-left p-3 font-semibold text-gray-700">Median Range</th>
              <th className="text-left p-3 font-semibold text-gray-700">High Range</th>
              <th className="text-left p-3 font-semibold text-gray-700">Example Position</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="p-3 font-medium text-gray-900">{row.kpi}</td>
                <td className="p-3 text-gray-700">{row.low}</td>
                <td className="p-3 text-gray-700">{row.median}</td>
                <td className="p-3 text-gray-700">{row.high}</td>
                <td className="p-3 text-brevo-green font-medium">{row.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
