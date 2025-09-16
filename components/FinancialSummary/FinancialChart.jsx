import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FinancialChart = ({ data }) => {
  const formatCurrency = (amount) => new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount);

  // Προσαρμογή δεδομένων για το γράφημα, στα πρότυπα της Επισκόπησης
  const chartData = (data || [])
    .map(item => ({
      name: item.month_name,
      Έσοδα: item.income,
      Έξοδα: item.expenses,
    }))
    .reverse(); // συνέπεια με το homepage

  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
          <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
          <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="Έσοδα" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 6, fill: '#2563eb' }} dot={{ r: 3, fill: '#2563eb' }} />
          <Line type="monotone" dataKey="Έξοδα" stroke="#dc2626" strokeWidth={2} activeDot={{ r: 6, fill: '#dc2626' }} dot={{ r: 3, fill: '#dc2626' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
