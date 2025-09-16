import React, { useState } from 'react';
import { deleteTransaction } from '../../lib/services/financialService';

const TransactionList = ({ transactions, onTransactionDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Μορφοποίηση ημερομηνίας σε αναγνώσιμη μορφή
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('el-GR');
  };

  // Μορφοποίηση του ποσού ως νόμισμα (€)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Διαγραφή συναλλαγής
  const handleDelete = async (id) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή τη συναλλαγή;')) {
      setLoading(true);
      setError(null);
      
      try {
        await deleteTransaction(id);
        onTransactionDeleted(); // Ενημέρωση του γονικού component
      } catch (err) {
        console.error('Error deleting transaction:', err);
        setError('Σφάλμα κατά τη διαγραφή της συναλλαγής.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Επιστροφή εικονιδίου βάσει κατηγορίας συναλλαγής
  const getCategoryIcon = (type, category) => {
    const icons = {
      income: {
        'parts_sale': 'bi-nut',
        'service': 'bi-tools',
        'scooter_sale': 'bi-scooter',
        'default': 'bi-cash-coin'
      },
      expense: {
        'salary': 'bi-person-badge',
        'rent': 'bi-house',
        'operational_expenses': 'bi-gear',
        'spare_parts_purchase': 'bi-nut',
        'equipment_maintenance': 'bi-tools',
        'default': 'bi-credit-card'
      }
    };
    
    return icons[type]?.[category] || icons[type]?.default || 'bi-receipt';
  };
  
  // Μετάφραση κατηγορίας
  const translateCategory = (category) => {
    const translations = {
      'parts_sale': 'Πώληση Ανταλλακτικών',
      'service': 'Υπηρεσία Επισκευής',
      'scooter_sale': 'Πώληση Σκούτερ',
      'salary': 'Μισθοδοσία',
      'rent': 'Ενοίκιο',
      'operational_expenses': 'Λειτουργικά Έξοδα',
      'spare_parts_purchase': 'Αγορά Ανταλλακτικών',
      'equipment_maintenance': 'Συντήρηση Εξοπλισμού',
      'other_expenses': 'Λοιπά Έξοδα',
      'other_income': 'Λοιπά Έσοδα'
    };
    
    return translations[category] || category;
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Φόρτωση...</span>
          </div>
        </div>
      )}
      
      <div className="transactions-container">
        {transactions.map(transaction => (
          <div key={transaction.id} className="transaction-card modern-card hover-lift h-100">
            <div className="d-flex w-100 justify-content-between align-items-start">
              <div className="d-flex align-items-center">
                <div
                  className={`me-3 rounded-circle d-flex align-items-center justify-content-center p-2 ${
                    transaction.type === 'income' ? 'bg-success' : 'bg-danger'
                  }`}
                  style={{ width: '40px', height: '40px', color: 'white' }}
                >
                  <i className={`bi ${getCategoryIcon(transaction.type, transaction.category)}`}></i>
                </div>
                <div>
                  <h6 className="mb-1 fw-bold">{transaction.description}</h6>
                  <small className="text-muted">
                    {translateCategory(transaction.category)} • {formatDate(transaction.date)}
                  </small>
                </div>
              </div>
              <div className="text-end">
                <div className={`fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {transaction.type === 'income' ? '+ ' : '- '}
                  {formatCurrency(transaction.amount)}
                </div>
                <button
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => handleDelete(transaction.id)}
                  disabled={loading}
                  title="Διαγραφή"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && !loading && (
        <div className="text-center text-muted my-4">
          <i className="bi bi-inbox fs-1"></i>
          <p>Δεν υπάρχουν συναλλαγές.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
