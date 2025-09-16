import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CATEGORY_LABELS = {
  // income
  parts_sale: 'Πώληση Ανταλλακτικών',
  service: 'Υπηρεσίες Επισκευής',
  scooter_sale: 'Πώληση Σκούτερ',
  other_income: 'Λοιπά Έσοδα',
  // expenses
  salary: 'Μισθοδοσία',
  rent: 'Ενοίκιο',
  operational_expenses: 'Λειτουργικά Έξοδα',
  spare_parts_purchase: 'Αγορά Ανταλλακτικών',
  equipment_maintenance: 'Συντήρηση Εξοπλισμού',
  other_expenses: 'Λοιπά Έξοδα',
};

const CATEGORY_COLORS = {
  // income colors
  parts_sale: '#2563eb',
  service: '#10b981',
  scooter_sale: '#f59e0b',
  other_income: '#6b7280',
  // expense colors
  salary: '#8b5cf6',
  rent: '#14b8a6',
  operational_expenses: '#64748b',
  spare_parts_purchase: '#1d4ed8',
  equipment_maintenance: '#ef4444',
  other_expenses: '#6b7280',
};

const defaultPalette = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#64748b', '#6b7280'];

const formatCurrency = (amount) => new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount || 0);

const CategoryDonut = ({ data }) => {
  const chartData = (data || []).map((d, idx) => ({
    name: CATEGORY_LABELS[d.category] || d.category,
    value: Number(d.total) || 0,
    color: CATEGORY_COLORS[d.category] || defaultPalette[idx % defaultPalette.length],
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const renderLegend = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {chartData.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 220 }}>
          <span style={{ width: 10, height: 10, background: item.color, display: 'inline-block', borderRadius: 2 }}></span>
          <span style={{ color: '#374151', fontWeight: 600 }}>{item.name}</span>
          <span style={{ marginLeft: 'auto', color: '#6b7280' }}>{formatCurrency(item.value)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="row g-4 align-items-center">
      <div className="col-xl-6" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend verticalAlign="bottom" height={0} content={() => null} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="col-xl-6">
        {renderLegend()}
        <div className="mt-3" style={{ color: '#111827', fontWeight: 700 }}>
          Σύνολο: {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
};

export default CategoryDonut;

