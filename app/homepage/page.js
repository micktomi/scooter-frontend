"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Professional Stat Card Component
const StatCard = ({ title, value, icon, href }) => (
  <Link href={href} className="stat-card">
    <div className="stat-card-icon">
      <i className={`bi ${icon}`}></i>
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-label">{title}</div>
  </Link>
);

function HomePage() {
  const [stats, setStats] = useState({ customers: 0, activeRentals: 0, totalIncome: 0, availableScooters: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersRes, rentalsRes, monthlyRes, scootersRes] = await Promise.all([
          apiClient.get('/customers/'),
          apiClient.get('/rentals/?limit=5'),
          apiClient.get('/financial/monthly/'),
          apiClient.get('/scooters/')
        ]);

        const totalIncome = monthlyRes.data.reduce((sum, month) => sum + month.income, 0);

        const availableScooters = (scootersRes.data || []).filter(s => !(s.is_sold ?? s.isSold ?? false)).length;

        setStats({
          customers: customersRes.data.length,
          activeRentals: rentalsRes.data.filter(r => r.status === 'Ενεργή').length,
          totalIncome: totalIncome,
          availableScooters,
        });
        
        const chartData = monthlyRes.data.map(item => ({
          name: new Date(item.month).toLocaleString('el-GR', { month: 'short' }),
          Έσοδα: item.income,
          Έξοδα: item.expenses,
        })).reverse();
        setMonthlyData(chartData);

        setRecentRentals(rentalsRes.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Δεν ήταν δυνατή η φόρτωση των δεδομένων.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #2563eb', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Φόρτωση dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        background: '#fee2e2', 
        border: '1px solid #fecaca', 
        borderRadius: '8px', 
        padding: '16px', 
        color: '#dc2626' 
      }}>
        <i className="bi bi-exclamation-triangle" style={{ marginRight: '8px' }}></i>
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title">
          <i className="bi bi-speedometer2" style={{ color: '#2563eb', marginRight: '12px' }}></i>
          Επισκόπηση
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Γενική εικόνα της επιχείρησής σας</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          title="Συνολικά Έσοδα" 
          value={formatCurrency(stats.totalIncome)} 
          icon="bi-graph-up" 
          href="/financialpage"
        />
        <StatCard 
          title="Ενεργές Ενοικιάσεις" 
          value={stats.activeRentals} 
          icon="bi-clipboard-check" 
          href="/rentalspage"
        />
        <StatCard 
          title="Σύνολο Πελατών" 
          value={stats.customers} 
          icon="bi-people" 
          href="/customerpage"
        />
        <StatCard 
          title="Διαθέσιμα Σκούτερ" 
          value={stats.availableScooters} 
          icon="bi-scooter" 
          href="/scooterpage"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '32px' }}>
        {/* Chart Section */}
        <div className="chart-container">
          <h2 className="chart-title">
            <i className="bi bi-graph-up"></i>
            Μηνιαία Έσοδα & Έξοδα
          </h2>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 14, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)} 
                  tick={{ fontSize: 14, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)} 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Έσοδα" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  activeDot={{ r: 6, fill: '#2563eb' }}
                  dot={{ fill: '#2563eb', strokeWidth: 0, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Έξοδα" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: '#dc2626' }}
                  dot={{ fill: '#dc2626', strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Rentals */}
        <div className="professional-card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <h3 className="card-title">
              <i className="bi bi-clock-history" style={{ color: '#2563eb', marginRight: '8px' }}></i>
              Πρόσφατες Ενοικιάσεις
            </h3>
            <Link href="/rentalspage" className="btn-outline">
              Δες όλες
            </Link>
          </div>
          
          {recentRentals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
              <i className="bi bi-inbox" style={{ fontSize: '48px', opacity: 0.3, display: 'block', marginBottom: '16px' }}></i>
              <p>Δεν υπάρχουν πρόσφατες ενοικιάσεις</p>
            </div>
          ) : (
            <table className="professional-table">
              <thead>
                <tr>
                  <th>Πελάτης</th>
                  <th>Σκούτερ</th>
                  <th>Κατάσταση</th>
                  <th>Ποσό</th>
                </tr>
              </thead>
              <tbody>
                {recentRentals.map((rental) => (
                  <tr key={rental.id}>
                    <td>{rental.customer?.name || 'N/A'}</td>
                    <td>{rental.scooter?.model || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${
                        rental.status === 'Ενεργή' ? 'status-active' :
                        rental.status === 'Ολοκληρωμένη' ? 'status-completed' : 'status-cancelled'
                      }`}>
                        {rental.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#059669' }}>
                      {formatCurrency(rental.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="professional-card" style={{ marginTop: '24px' }}>
        <h3 className="card-title">
          <i className="bi bi-lightning-charge" style={{ color: '#2563eb', marginRight: '8px' }}></i>
          Γρήγορες Ενέργειες
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/rentalspage/new" className="btn-professional">
            <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i>
            Νέα Ενοικίαση
          </Link>
          <Link href="/customerpage/new" className="btn-outline">
            <i className="bi bi-person-plus" style={{ marginRight: '8px' }}></i>
            Νέος Πελάτης
          </Link>
          <Link href="/servicespage/new" className="btn-outline">
            <i className="bi bi-tools" style={{ marginRight: '8px' }}></i>
            Νέο Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
