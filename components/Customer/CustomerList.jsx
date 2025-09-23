"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/services/api';
import Link from 'next/link';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Φόρτωση δεδομένων από το API
    apiClient.get('/customers/')
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
        console.log('Customers loaded:', response.data);
      })
      .catch(error => {
        setError('Αδυναμία φόρτωσης πελατών');
        setLoading(false);
        console.error('Error loading customers:', error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον πελάτη;')) {
      apiClient.delete(`/customers/${id}`)
        .then(() => {
          setCustomers(customers.filter(customer => customer.id !== id));
        })
        .catch(error => {
          console.error('Error deleting customer:', error);
          setError('Σφάλμα κατά τη διαγραφή');
        });
    }
  };

  // Φιλτράρισμα πελατών
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="loading-spinner-modern loading-spinner"></div>
            <p className="mt-3 text-muted">Φόρτωση πελατών...</p>
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
            <i className="bi bi-people text-primary me-3"></i>
            Διαχείριση Πελατών
          </h1>
          <p className="text-muted mb-0">Διαχειριστείτε όλους τους πελάτες σας</p>
        </div>
        <Link href="/customerpage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
          <i className="bi bi-plus-lg me-2"></i>Νέος Πελάτης
        </Link>
      </div>

      {error && (
        <div className="alert alert-modern alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Αναζήτηση */}
      <div className="modern-card mb-5">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">
            <i className="fas fa-search text-primary me-2"></i>
            Αναζήτηση Πελατών
          </h6>
          <div className="row g-3">
            <div className="col-md-8">
              <div className="modern-search">
            <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Αναζήτηση ονόματος, τηλεφώνου, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-secondary w-100 hover-btn"
                onClick={() => setSearchTerm('')}
                style={{ height: '50px', borderRadius: '25px' }}
              >
                <i className="bi bi-eraser me-2"></i>Καθαρισμός
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-5">
          <div className="modern-card">
            <div className="card-body p-5">
              <div className="empty-state">
                <i className="fas fa-user-friends text-muted mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                <h4 className="text-muted mb-3">Δεν βρέθηκαν πελάτες</h4>
                <p className="text-muted mb-4">
                  {searchTerm 
                    ? "Δεν υπάρχουν πελάτες που να ταιριάζουν με τα κριτήρια αναζήτησης."
                    : "Δεν υπάρχουν καταχωρημένοι πελάτες ακόμη."
                  }
                </p>
                <Link href="/customerpage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
                  <i className="fas fa-plus me-2"></i>Προσθέστε τον πρώτο πελάτη
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="customers-container row g-3">
          {filteredCustomers.map((customer, index) => (
            <div key={customer.id} className="col-sm-6 col-lg-4 col-xl-3 stagger-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="customer-card modern-card hover-lift h-100" style={{ minHeight: '220px' }}>
                <div className="card-header bg-white border-0 pb-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                      <i className="bi bi-person text-primary me-1"></i>
                      {customer.name}
                    </h6>
                    <span className="status-badge status-active" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                      Ενεργός
                    </span>
                  </div>
                </div>
                <div className="card-body py-2">
                  <div className="customer-info">
                    <div className="row g-1 mb-2">
                      {customer.phone && (
                        <div className="col-6">
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>ΤΗΛΕΦΩΝΟ</div>
                          <div className="fw-bold" style={{ fontSize: '0.8rem' }}>
                            <a href={`tel:${customer.phone}`} className="text-decoration-none">
                              {customer.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {customer.email && (
                        <div className="col-6">
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>EMAIL</div>
                          <div className="fw-bold" style={{ fontSize: '0.8rem' }}>
                            <a href={`mailto:${customer.email}`} className="text-decoration-none">
                              {customer.email}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row g-1 mb-2">
                      <div className="col-6">
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>ID</div>
                        <div className="fw-bold" style={{ fontSize: '0.8rem' }}>#{customer.id}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pt-1">
                  <div className="btn-group w-100" style={{ fontSize: '0.75rem' }}>
                    <Link
                      href={`/customerpage/edit/${customer.id}`}
                      className="btn btn-outline-primary hover-btn py-1"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <i className="bi bi-pencil-square me-1"></i>Επεξεργασία
                    </Link>
                    <button
                      className="btn btn-outline-danger hover-btn py-1"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleDelete(customer.id)}
                    >
                      <i className="bi bi-trash me-1"></i>Διαγραφή
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Στατιστικά */}
      {customers.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="modern-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="fas fa-chart-bar text-primary me-2"></i>
                  Στατιστικά Πελατών
                </h5>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-users text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">{customers.length}</h3>
                      <small className="text-white opacity-75">Συνολικοί Πελάτες</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-phone text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {customers.filter(c => c.phone).length}
                      </h3>
                      <small className="text-white opacity-75">Με Τηλέφωνο</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #26D0CE 0%, #1A2C5B 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-envelope text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {customers.filter(c => c.email).length}
                      </h3>
                      <small className="text-white opacity-75">Με Email</small>
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

export default CustomerList;
