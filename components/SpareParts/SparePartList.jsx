"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/services/api';

function SparePartList() {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'low-stock', 'adequate'

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const response = await apiClient.get('/spare-parts/');
      setSpareParts(response.data);
      setError(null);
    } catch (err) {
      setError('Σφάλμα κατά τη φόρτωση των ανταλλακτικών.');
      console.error('Error fetching spare parts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Φιλτράρισμα ανταλλακτικών
  const filteredSpareParts = spareParts.filter(part => {
    const matchesSearch = 
      part.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = (() => {
      if (filter === 'all') return true;
      if (filter === 'low-stock') return part.stock <= part.min_stock;
      if (filter === 'adequate') return part.stock > part.min_stock;
      return true;
    })();
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το ανταλλακτικό;')) {
      try {
        await apiClient.delete(`/spare-parts/${id}`);
        fetchSpareParts(); // Επαναφόρτωση της λίστας
      } catch (err) {
        setError('Σφάλμα κατά τη διαγραφή του ανταλλακτικού.');
        console.error('Error deleting spare part:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="loading-spinner-modern loading-spinner"></div>
            <p className="mt-3 text-muted">Φόρτωση ανταλλακτικών...</p>
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
            <i className="bi bi-nut text-primary me-3"></i>
            Διαχείριση Ανταλλακτικών
          </h1>
          <p className="text-muted mb-0">Διαχειριστείτε όλα τα ανταλλακτικά σας</p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/spare-parts/sell" className="btn btn-modern btn-modern-success btn-lg hover-lift">
            <i className="fas fa-shopping-cart me-2"></i>Πώληση
          </Link>
          <Link href="/spare-parts/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
            <i className="fas fa-plus me-2"></i>Νέο Ανταλλακτικό
          </Link>
        </div>
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
                  placeholder="Αναζήτηση ονόματος, κωδικού, κατηγορίας..."
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
                  className={`btn hover-btn ${filter === 'low-stock' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFilter('low-stock')}
                >
                  <i className="fas fa-exclamation-triangle me-1"></i> Χαμηλό Απόθεμα
                </button>
                <button 
                  type="button" 
                  className={`btn hover-btn ${filter === 'adequate' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('adequate')}
                >
                  <i className="fas fa-check-circle me-1"></i> Επαρκές
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredSpareParts.length === 0 ? (
        <div className="text-center py-5">
          <div className="modern-card">
            <div className="card-body p-5">
              <div className="empty-state">
              <i className="bi bi-nut text-muted mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                <h4 className="text-muted mb-3">Δεν βρέθηκαν ανταλλακτικά</h4>
                <p className="text-muted mb-4">
                  {searchTerm || filter !== 'all' 
                    ? "Δεν υπάρχουν ανταλλακτικά που να ταιριάζουν με τα κριτήρια αναζήτησης."
                    : "Δεν υπάρχουν καταχωρημένα ανταλλακτικά ακόμη."
                  }
                </p>
                <Link href="/spare-parts/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
                  <i className="fas fa-plus me-2"></i>Προσθέστε το πρώτο ανταλλακτικό
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="spareparts-container row g-3">
          {filteredSpareParts.map((part, index) => (
            <div key={part.id} className="col-sm-6 col-lg-4 col-xl-3 stagger-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="sparepart-card modern-card hover-lift h-100" style={{ minHeight: '280px' }}>
              <div className="card-header bg-white border-0 pb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0 text-dark">
                      <i className="bi bi-nut text-primary me-2"></i>
                      {part.name}
                    </h6>
                    <span className={`status-badge ${part.stock <= part.min_stock ? 'status-cancelled' : 'status-active'}`}>
                      {part.stock <= part.min_stock ? 'Χαμηλό Απόθεμα' : 'Επαρκές'}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="part-info mb-3">
                    {part.code && (
                      <div className="info-item mb-3">
                        <div className="info-header d-flex align-items-center mb-1">
                          <i className="fas fa-barcode text-info me-2"></i>
                          <small className="text-muted fw-semibold">ΚΩΔΙΚΟΣ</small>
                        </div>
                        <div className="fw-bold">{part.code}</div>
                      </div>
                    )}
                    
                    {part.category && (
                      <div className="info-item mb-3">
                        <div className="info-header d-flex align-items-center mb-1">
                          <i className="fas fa-tags text-warning me-2"></i>
                          <small className="text-muted fw-semibold">ΚΑΤΗΓΟΡΙΑ</small>
                        </div>
                        <div className="fw-bold">{part.category}</div>
                      </div>
                    )}
                    
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-boxes text-secondary me-2"></i>
                        <small className="text-muted fw-semibold">ΑΠΟΘΕΜΑ</small>
                      </div>
                      <div className={`fw-bold fs-5 ${part.stock <= part.min_stock ? 'text-danger' : 'text-success'}`}>
                        {part.stock} τεμ.
                      </div>
                    </div>
                    
                    {part.selling_price && (
                      <div className="info-item mb-3">
                        <div className="info-header d-flex align-items-center mb-1">
                          <i className="fas fa-euro-sign text-success me-2"></i>
                          <small className="text-muted fw-semibold">ΤΙΜΗ ΠΩΛΗΣΗΣ</small>
                        </div>
                        <div className="fw-bold text-success fs-5">€{part.selling_price}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer bg-white border-0">
                  <div className="d-grid gap-2">
                    <div className="btn-group">
                      <Link
                        href={`/spare-parts/${part.id}`}
                        className="btn btn-outline-info hover-btn"
                      >
                        <i className="fas fa-eye me-2"></i>Προβολή
                      </Link>
                      <Link
                        href={`/spare-parts/edit/${part.id}`}
                        className="btn btn-outline-primary hover-btn"
                      >
                        <i className="fas fa-edit me-2"></i>Επεξεργασία
                      </Link>
                    </div>
                    <button
                      className="btn btn-outline-danger hover-btn"
                      onClick={() => handleDelete(part.id)}
                    >
                      <i className="fas fa-trash me-2"></i>Διαγραφή
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Στατιστικά */}
      {spareParts.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="modern-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="fas fa-chart-bar text-primary me-2"></i>
                  Στατιστικά Ανταλλακτικών
                </h5>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="bi bi-nut text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">{spareParts.length}</h3>
                      <small className="text-white opacity-75">Συνολικά Ανταλλακτικά</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-check-circle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {spareParts.filter(p => p.stock > p.min_stock).length}
                      </h3>
                      <small className="text-white opacity-75">Επαρκές Απόθεμα</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-exclamation-triangle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {spareParts.filter(p => p.stock <= p.min_stock).length}
                      </h3>
                      <small className="text-white opacity-75">Χαμηλό Απόθεμα</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #26D0CE 0%, #1A2C5B 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-euro-sign text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        €{spareParts.filter(p => p.selling_price).reduce((sum, p) => sum + (parseFloat(p.selling_price) || 0), 0).toFixed(2)}
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

export default SparePartList;
