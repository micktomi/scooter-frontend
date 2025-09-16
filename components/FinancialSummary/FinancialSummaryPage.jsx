"use client";
import React, { useState, useEffect } from 'react';
import { 
  getFinancialSummary, 
  getMonthlyAnalysis, 
  getTransactions 
} from '../../lib/services/financialService';
import FinancialSummaryCard from './FinancialSummaryCard';
import FinancialChart from './FinancialChart';
import CategoryDonut from './CategoryDonut';
import TransactionList from './TransactionList';
import ExpenseForm from './ExpenseForm';

const FinancialSummaryPage = () => {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Φόρτωση δεδομένων
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Παράλληλα φορτώνουμε όλα τα δεδομένα
      const [summaryData, monthlyDataResult, transactionsResult] = await Promise.all([
        getFinancialSummary(dateRange.startDate, dateRange.endDate),
        getMonthlyAnalysis(dateRange.startDate, dateRange.endDate),
        getTransactions({
          startDate: dateRange.startDate, 
          endDate: dateRange.endDate, 
          limit: 10
        })
      ]);
      
      setSummary(summaryData);
      setMonthlyData(monthlyDataResult);
      setRecentTransactions(transactionsResult);
    } catch (err) {
      console.error('Error loading financial data:', err);
      setError('Σφάλμα κατά τη φόρτωση των οικονομικών δεδομένων. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  // Φόρτωση δεδομένων κατά την αρχικοποίηση του component
  useEffect(() => {
    loadData();
  }, [dateRange]);
  
  // Έλεγχος για νέες συναλλαγές
  useEffect(() => {
    // Έλεγχος αν υπάρχουν νέες συναλλαγές (πωλήσεις σκούτερ, ανταλλακτικών ή υπηρεσίες)
    const newTransactionFlag = localStorage.getItem('newFinancialTransaction');
    
    if (newTransactionFlag === 'true') {
      // Φόρτωση των νέων δεδομένων
      loadData();
      
      // Καθαρισμός του flag
      localStorage.removeItem('newFinancialTransaction');
    }
    
    // Δημιουργία event listener για παρακολούθηση αλλαγών στο localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'newFinancialTransaction' && e.newValue === 'true') {
        loadData();
        localStorage.removeItem('newFinancialTransaction');
      }
    };
    
    // Προσθήκη του event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Καθαρισμός του event listener όταν το component καταστρέφεται
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Ενημέρωση του χρονικού διαστήματος
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };
  
  // Ανανέωση των δεδομένων
  const handleRefresh = () => {
    loadData();
  };

  // Χειρισμός προσθήκης νέου εξόδου
  const handleExpenseAdded = () => {
    loadData(); // Επαναφόρτωση όλων των δεδομένων
  };
  
  // Μορφοποίηση του ποσού ως νόμισμα (€)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="loading-spinner-modern loading-spinner"></div>
            <p className="mt-3 text-muted">Φόρτωση οικονομικών δεδομένων...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="display-6 fw-bold text-dark">
            <i className="fas fa-chart-line text-primary me-3"></i>
            Οικονομική Ανάλυση
          </h1>
          <p className="text-muted mb-0">Παρακολουθήστε τα έσοδα και έξοδα της επιχείρησης</p>
        </div>
        <button
          className="btn btn-modern btn-modern-primary btn-lg hover-lift"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <i className="fas fa-sync-alt me-2"></i>
          {isLoading ? 'Φόρτωση...' : 'Ανανέωση'}
        </button>
      </div>

      {/* Μηνιαίο γράφημα – αμέσως κάτω από τον τίτλο */}
      <div className="modern-card mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">
            <i className="fas fa-chart-area text-primary me-2"></i>
            Μηνιαία Οικονομική Ανάλυση
          </h5>
          {monthlyData.length > 0 ? (
            <FinancialChart data={monthlyData} />
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-chart-line text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              <h6 className="text-muted">Δεν υπάρχουν δεδομένα για το επιλεγμένο διάστημα</h6>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="alert alert-modern alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
      
      {/* Φίλτρα ημερομηνίας */}
      <div className="modern-card mb-5">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">
            <i className="fas fa-calendar-alt text-primary me-2"></i>
            Χρονικό Διάστημα Ανάλυσης
          </h6>
          <div className="row g-3">
            <div className="col-md-5">
              <label htmlFor="startDate" className="form-label fw-semibold">Από</label>
              <input
                type="date"
                className="form-control form-control-lg"
                id="startDate"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="endDate" className="form-label fw-semibold">Έως</label>
              <input
                type="date"
                className="form-control form-control-lg"
                id="endDate"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-modern btn-modern-success w-100 btn-lg hover-lift"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <i className="fas fa-filter me-2"></i>Εφαρμογή
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Συνοπτικές κάρτες */}
      {summary && (
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="modern-card hover-lift h-100">
              <div className="card-body p-4 text-center">
                <div className="stat-card p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                  <div className="stat-icon mb-2">
                    <i className="fas fa-arrow-up text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="text-white fw-bold mb-1">{formatCurrency(summary.total_income)}</h3>
                  <small className="text-white opacity-75">Συνολικά Έσοδα</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="modern-card hover-lift h-100">
              <div className="card-body p-4 text-center">
                <div className="stat-card p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)' }}>
                  <div className="stat-icon mb-2">
                    <i className="fas fa-arrow-down text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="text-white fw-bold mb-1">{formatCurrency(summary.total_expenses)}</h3>
                  <small className="text-white opacity-75">Συνολικά Έξοδα</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="modern-card hover-lift h-100">
              <div className="card-body p-4 text-center">
                <div className="stat-card p-3 rounded-3" style={{ 
                  background: summary.profit >= 0 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)' 
                }}>
                  <div className="stat-icon mb-2">
                    <i className={`fas ${summary.profit >= 0 ? 'fa-coins' : 'fa-exclamation-triangle'} text-white`} 
                       style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="text-white fw-bold mb-1">{formatCurrency(summary.profit)}</h3>
                  <small className="text-white opacity-75">
                    {summary.profit >= 0 ? 'Κέρδος' : 'Ζημιά'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="row g-4">
        {/* Πίνακας & πρόσφατες συναλλαγές */}
        <div className="col-lg-8">
          {/* Πρόσφατες συναλλαγές */}
          <div className="modern-card mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="fas fa-receipt text-primary me-2"></i>
                Πρόσφατες Συναλλαγές
              </h5>
              <TransactionList 
                transactions={recentTransactions}
                onTransactionDeleted={handleRefresh}
              />
              {recentTransactions.length === 0 && !isLoading && (
                <div className="text-center py-4">
                  <i className="fas fa-file-invoice text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  <h6 className="text-muted">Δεν υπάρχουν συναλλαγές για το επιλεγμένο διάστημα</h6>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar με φόρμες και αναλύσεις */}
        <div className="col-lg-4">
          {/* Φόρμα προσθήκης εξόδων */}
          <div className="modern-card mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="fas fa-plus-circle text-primary me-2"></i>
                Προσθήκη Εξόδου
              </h5>
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </div>
          </div>
          
          {/* Ανάλυση εσόδων ανά κατηγορία */}
          {summary && summary.income_by_category && (
            <div className="modern-card mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-graph-up text-success me-2"></i>
                  Έσοδα ανά Κατηγορία
                </h5>
                <CategoryDonut data={summary.income_by_category} />
              </div>
            </div>
          )}
          
          {/* Ανάλυση εξόδων ανά κατηγορία */}
          {summary && summary.expenses_by_category && (
            <div className="modern-card mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-pie-chart text-danger me-2"></i>
                  Έξοδα ανά Κατηγορία
                </h5>
                <CategoryDonut data={summary.expenses_by_category} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryPage;
