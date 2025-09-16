"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/services/api';

function ScooterList() {
  const [scooters, setScooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'sold'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScooters();
  }, []);

  const fetchScooters = async () => {
    try {
      const response = await apiClient.get('/scooters/');
      // Κανονικοποίηση πεδίων (υποστήριξη και camelCase από backend)
      const normalized = (response.data || []).map(s => ({
        ...s,
        is_sold: s.is_sold ?? s.isSold ?? false,
        sold_date: s.sold_date ?? s.soldDate ?? null,
        sold_to_customer_id: s.sold_to_customer_id ?? s.soldToCustomerId ?? null,
        purchase_price: s.purchase_price ?? s.purchasePrice ?? null,
        selling_price: s.selling_price ?? s.sellingPrice ?? null,
        customer_id: s.customer_id ?? s.customerId ?? null,
      }));
      setScooters(normalized);
      setError(null);
    } catch (err) {
      setError('Σφάλμα κατά τη φόρτωση των σκούτερ.');
      console.error('Error fetching scooters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το σκούτερ;')) {
      try {
        await apiClient.delete(`/scooters/${id}`);
        fetchScooters(); // Επαναφόρτωση της λίστας
      } catch (err) {
        setError('Σφάλμα κατά τη διαγραφή του σκούτερ.');
        console.error('Error deleting scooter:', err);
      }
    }
  };

  // Φιλτράρισμα σκούτερ
  const filteredScooters = scooters.filter(scooter => {
    const matchesSearch = 
      scooter.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scooter.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scooter.plate?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = (() => {
      if (filter === 'all') return true;
      if (filter === 'available') return !scooter.is_sold;
      if (filter === 'sold') return scooter.is_sold;
      return true;
    })();
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="loading-spinner-modern loading-spinner"></div>
            <p className="mt-3 text-muted">Φόρτωση σκούτερ...</p>
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
            <i className="fas fa-motorcycle text-primary me-3"></i>
            Διαχείριση Σκούτερ
          </h1>
          <p className="text-muted mb-0">Διαχειριστείτε όλα τα σκούτερ σας</p>
        </div>
        <Link href="/scooterpage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
          <i className="fas fa-plus me-2"></i>Νέο Σκούτερ
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
            Φίλτρα & Αναζήτηση
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="modern-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Αναζήτηση μάρκας, μοντέλου, πινακίδας..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                <button 
                  type="button" 
                  className={`btn hover-btn ${filter === 'all' ? 'btn-modern btn-modern-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  <i className="fas fa-list me-1"></i> Όλα
                </button>
                <button 
                  type="button" 
                  className={`btn hover-btn ${filter === 'available' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('available')}
                >
                  <i className="fas fa-check-circle me-1"></i> Διαθέσιμα
                </button>
                <button 
                  type="button" 
                  className={`btn hover-btn ${filter === 'sold' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFilter('sold')}
                >
                  <i className="fas fa-times-circle me-1"></i> Πωλημένα
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredScooters.length === 0 ? (
        <div className="text-center py-5">
          <div className="modern-card">
            <div className="card-body p-5">
              <div className="empty-state">
                <i className="fas fa-search text-muted mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                <h4 className="text-muted mb-3">Δεν βρέθηκαν σκούτερ</h4>
                <p className="text-muted mb-4">
                  {searchTerm || filter !== 'all' 
                    ? "Δεν υπάρχουν σκούτερ που να ταιριάζουν με τα κριτήρια αναζήτησης."
                    : "Δεν υπάρχουν καταχωρημένα σκούτερ ακόμη."
                  }
                </p>
                <Link href="/scooterpage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
                  <i className="fas fa-plus me-2"></i>Προσθέστε το πρώτο σκούτερ
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="scooters-container row g-3">
          {filteredScooters.map((scooter, index) => (
            <div key={scooter.id} className="col-sm-6 col-lg-4 col-xl-3 stagger-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="scooter-card modern-card hover-lift h-100" style={{ minHeight: '280px' }}>
                <div className="card-header bg-white border-0 pb-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                      <i className="fas fa-motorcycle text-primary me-1"></i>
                      {scooter.brand} {scooter.model}
                    </h6>
                    <span className={`status-badge ${scooter.is_sold ? 'status-cancelled' : 'status-active'}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                      {scooter.is_sold ? 'Πωλήθηκε' : 'Διαθέσιμο'}
                    </span>
                  </div>
                </div>
                <div className="card-body py-2">
                  <div className="scooter-info">
                    <div className="row g-1 mb-2">
                      {scooter.plate && (
                        <div className="col-6">
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>ΠΙΝΑΚΙΔΑ</div>
                          <div className="fw-bold" style={{ fontSize: '0.8rem' }}>{scooter.plate}</div>
                        </div>
                      )}
                      {scooter.year && (
                        <div className="col-6">
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>ΕΤΟΣ</div>
                          <div className="fw-bold" style={{ fontSize: '0.8rem' }}>{scooter.year}</div>
                        </div>
                      )}
                    </div>
                    <div className="row g-1 mb-2">
                      <div className="col-6">
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>ΚΑΤΑΣΤΑΣΗ</div>
                        <div className="fw-bold" style={{ fontSize: '0.8rem' }}>{scooter.condition}</div>
                      </div>
                      {scooter.price && (
                        <div className="col-6">
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>ΤΙΜΗ</div>
                          <div className="fw-bold text-success" style={{ fontSize: '0.9rem' }}>€{scooter.price}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pt-1">
                  <div className="btn-group w-100" style={{ fontSize: '0.75rem' }}>
                    <Link
                      href={`/scooterpage/edit/${scooter.id}`}
                      className="btn btn-outline-primary hover-btn py-1"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <i className="fas fa-edit me-1"></i>Επεξεργασία
                    </Link>
                    <button
                      className="btn btn-outline-danger hover-btn py-1"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleDelete(scooter.id)}
                    >
                      <i className="fas fa-trash me-1"></i>Διαγραφή
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Στατιστικά */}
      {scooters.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="modern-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="fas fa-chart-bar text-primary me-2"></i>
                  Στατιστικά Σκούτερ
                </h5>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-motorcycle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">{scooters.length}</h3>
                      <small className="text-white opacity-75">Συνολικά Σκούτερ</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-check-circle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {scooters.filter(s => !s.is_sold).length}
                      </h3>
                      <small className="text-white opacity-75">Διαθέσιμα</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-times-circle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {scooters.filter(s => s.is_sold).length}
                      </h3>
                      <small className="text-white opacity-75">Πωλημένα</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #26D0CE 0%, #1A2C5B 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-euro-sign text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        €{scooters.filter(s => s.price).reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2)}
                      </h3>
                      <small className="text-white opacity-75">Συνολική Αξία</small>
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

export default ScooterList;
