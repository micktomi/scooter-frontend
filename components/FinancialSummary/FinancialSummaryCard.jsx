import React from 'react';

const FinancialSummaryCard = ({ title, amount, icon, color }) => {
  // Μορφοποίηση του ποσού ως νόμισμα (€)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={`card border-${color} mb-3`}>
      <div className="card-body">
        <div className="row">
          <div className="col-9">
            <h5 className="card-title">{title}</h5>
            <h2 className={`text-${color}`}>{formatCurrency(amount)}</h2>
          </div>
          <div className="col-3 d-flex align-items-center justify-content-center">
            <i className={`bi ${icon} text-${color}`} style={{ fontSize: '2.5rem' }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;