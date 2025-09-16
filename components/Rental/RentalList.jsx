"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchRentals, deleteRental } from '../../lib/services/rentalService';

function RentalList() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await fetchRentals();
      setRentals(data);
      setError(null);
    } catch (error) {
      setError('Σφάλμα κατά τη φόρτωση των ενοικιάσεων.');
      console.error('Error loading rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rentalId) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτήν την ενοικίαση;')) {
      try {
        await deleteRental(rentalId);
        await loadRentals(); // Ανανέωση της λίστας
      } catch (error) {
        setError('Σφάλμα κατά την διαγραφή της ενοικίασης.');
        console.error('Error deleting rental:', error);
      }
    }
  };

  // Φιλτράρισμα ενοικιάσεων
  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = searchTerm === '' || 
      rental.scooter?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.scooter?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.scooter?.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.id.toString().includes(searchTerm) ||
      rental.scooter_id?.toString().includes(searchTerm) ||
      rental.customer_id?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === '' || rental.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Ενεργή':
        return 'badge bg-success';
      case 'Ολοκληρωμένη':
        return 'badge bg-secondary';
      case 'Ακυρωμένη':
        return 'badge bg-danger';
      default:
        return 'badge bg-primary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('el-GR');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="loading-spinner-modern loading-spinner"></div>
            <p className="mt-3 text-muted">Φόρτωση ενοικιάσεων...</p>
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
            <i className="fas fa-key text-primary me-3"></i>
            Ενοικιάσεις Σκούτερ
          </h1>
          <p className="text-muted mb-0">Διαχειριστείτε όλες τις ενοικιάσεις σας</p>
        </div>
        <Link href="/rentalspage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
          <i className="fas fa-plus me-2"></i>Νέα Ενοικίαση
        </Link>
      </div>

      {error && (
        <div className="alert alert-modern alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Φίλτρα αναζήτησης */}
      <div className="modern-card mb-5">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">
            <i className="fas fa-filter text-primary me-2"></i>
            Φίλτρα Αναζήτησης
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="modern-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Αναζήτηση σκούτερ, πελάτη..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-control modern-form"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ height: '50px', borderRadius: '25px' }}
              >
                <option value="">Όλες οι καταστάσεις</option>
                <option value="Ενεργή">Ενεργή</option>
                <option value="Ολοκληρωμένη">Ολοκληρωμένη</option>
                <option value="Ακυρωμένη">Ακυρωμένη</option>
              </select>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100 hover-btn"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                style={{ height: '50px', borderRadius: '25px' }}
              >
                <i className="fas fa-eraser me-2"></i>Καθαρισμός
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredRentals.length === 0 ? (
        <div className="text-center py-5">
          <div className="modern-card">
            <div className="card-body p-5">
              <div className="empty-state">
                <i className="fas fa-search text-muted mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                <h4 className="text-muted mb-3">Δεν βρέθηκαν ενοικιάσεις</h4>
                <p className="text-muted mb-4">
                  {searchTerm || statusFilter 
                    ? "Δεν υπάρχουν ενοικιάσεις που να ταιριάζουν με τα κριτήρια αναζήτησης."
                    : "Δεν υπάρχουν καταχωρημένες ενοικιάσεις ακόμη."
                  }
                </p>
                <Link href="/rentalspage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
                  <i className="fas fa-plus me-2"></i>Δημιουργήστε την πρώτη ενοικίαση
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rentals-container row g-3">
          {filteredRentals.map((rental, index) => (
            <div key={rental.id} className="col-sm-6 col-lg-4 col-xl-3 stagger-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="rental-card modern-card hover-lift h-100" style={{ minHeight: '280px' }}>
              <div className="card-header bg-white border-0 pb-2">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0 text-dark">
                      <i className="fas fa-motorcycle text-primary me-2"></i>
                      Ενοικίαση #{rental.id}
                    </h6>
                    <span className={`status-badge ${rental.status === 'Ενεργή' ? 'status-active' : rental.status === 'Ολοκληρωμένη' ? 'status-completed' : 'status-cancelled'}`}>
                      {rental.status}
                    </span>
                </div>
              </div>
              <div className="card-body">
                <div className="rental-info mb-3">
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-motorcycle text-danger me-2"></i>
                        <small className="text-muted fw-semibold">ΣΚΟΥΤΕΡ</small>
                      </div>
                      <div className="fw-bold">
                        {rental.scooter ? (
                          <>
                            {rental.scooter.brand} {rental.scooter.model}
                            {rental.scooter.plate && (
                              <small className="text-muted ms-2">({rental.scooter.plate})</small>
                            )}
                          </>
                        ) : (
                          <span className="text-muted">Σκούτερ #{rental.scooter_id}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-user text-info me-2"></i>
                        <small className="text-muted fw-semibold">ΠΕΛΑΤΗΣ</small>
                      </div>
                      <div className="fw-bold">
                        {rental.customer ? rental.customer.name : `Πελάτης #${rental.customer_id}`}
                      </div>
                    </div>
                    
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-calendar text-warning me-2"></i>
                        <small className="text-muted fw-semibold">ΠΕΡΙΟΔΟΣ</small>
                      </div>
                      <div className="small">
                        {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                      </div>
                    </div>
                    
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-euro-sign text-success me-2"></i>
                        <small className="text-muted fw-semibold">ΚΟΣΤΟΣ</small>
                      </div>
                      <div className="fw-bold text-success fs-5">€{rental.total_price}</div>
                    </div>
                    
                    {rental.notes && (
                      <div className="info-item">
                        <div className="info-header d-flex align-items-center mb-1">
                          <i className="fas fa-sticky-note text-secondary me-2"></i>
                          <small className="text-muted fw-semibold">ΣΗΜΕΙΩΣΕΙΣ</small>
                        </div>
                        <div className="small text-muted">{rental.notes}</div>
                      </div>
                    )}
                </div>
              </div>
              <div className="card-footer bg-white border-0">
                <div className="d-grid gap-2">
                  <div className="btn-group">
                    <Link
                      href={`/rentalspage/edit/${rental.id}`}
                      className="btn btn-outline-primary hover-btn"
                    >
                      <i className="fas fa-edit me-2"></i>Επεξεργασία
                    </Link>
                    <button
                      className="btn btn-outline-danger hover-btn"
                      onClick={() => handleDelete(rental.id)}
                    >
                      <i className="fas fa-trash me-2"></i>Διαγραφή
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}

      {/* Στατιστικά */}
      {rentals.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="modern-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="fas fa-chart-bar text-primary me-2"></i>
                  Στατιστικά Ενοικιάσεων
                </h5>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-list text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">{rentals.length}</h3>
                      <small className="text-white opacity-75">Συνολικές Ενοικιάσεις</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-play-circle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {rentals.filter(r => r.status === 'Ενεργή').length}
                      </h3>
                      <small className="text-white opacity-75">Ενεργές</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-check-circle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {rentals.filter(r => r.status === 'Ολοκληρωμένη').length}
                      </h3>
                      <small className="text-white opacity-75">Ολοκληρωμένες</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #26D0CE 0%, #1A2C5B 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-euro-sign text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        €{rentals.reduce((sum, r) => sum + (r.total_price || 0), 0).toFixed(2)}
                      </h3>
                      <small className="text-white opacity-75">Συνολικά Έσοδα</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentalList;