import React, { useState } from 'react';
import { addExpense } from '../../lib/services/financialService';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Σημερινή ημερομηνία
    category: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Χειρισμός αλλαγών στη φόρμα
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Αν τροποποιηθεί η φόρμα μετά από επιτυχημένη προσθήκη
    if (success) {
      setSuccess(false);
    }
  };

  // Υποβολή φόρμας
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Επικύρωση
      if (!formData.description.trim()) {
        throw new Error('Παρακαλώ εισάγετε περιγραφή');
      }
      
      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        throw new Error('Παρακαλώ εισάγετε έγκυρο ποσό');
      }
      
      if (!formData.date) {
        throw new Error('Παρακαλώ επιλέξτε ημερομηνία');
      }
      
      // Προετοιμασία δεδομένων για αποστολή
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      // Αποστολή αιτήματος στο API
      await addExpense(expenseData);
      
      // Επιτυχής προσθήκη
      setSuccess(true);
      
      // Καθαρισμός φόρμας
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: formData.category // Διατήρηση της επιλεγμένης κατηγορίας
      });
      
      // Ενημέρωση του γονικού component
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err.message || 'Σφάλμα κατά την προσθήκη του εξόδου. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          Το έξοδο προστέθηκε με επιτυχία!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Κατηγορία</label>
          <select 
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Επιλέξτε κατηγορία</option>
            <option value="salary">Μισθοδοσία</option>
            <option value="rent">Ενοίκιο</option>
            <option value="operational_expenses">Λειτουργικά Έξοδα</option>
            <option value="spare_parts_purchase">Αγορά Ανταλλακτικών</option>
            <option value="equipment_maintenance">Συντήρηση Εξοπλισμού</option>
            <option value="other_expenses">Λοιπά Έξοδα</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Περιγραφή</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="π.χ. Πληρωμή ενοικίου Μαρτίου"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Ποσό (€)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Ημερομηνία</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Αποθήκευση...</>
            ) : (
              'Προσθήκη Εξόδου'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;