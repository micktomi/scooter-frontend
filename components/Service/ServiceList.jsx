"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/services/api';
import Link from 'next/link';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'

  // Φέρνει όλες τις υπηρεσίες από το backend
  const fetchServices = async () => {
    try {
      const response = await apiClient.get('/services/');
      setServices(response.data);
    } catch (error) {
      console.error('Σφάλμα φόρτωσης υπηρεσιών:', error);
      setError('Αδυναμία φόρτωσης υπηρεσιών');
    } finally {
      setLoading(false);
    }
  };

  // Διαγραφή υπηρεσίας
  const deleteService = async (id) => {
    if (window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε την υπηρεσία;")) {
      try {
        await apiClient.delete(`/services/${id}`);
        fetchServices(); // ανανέωση λίστας
      } catch (error) {
        console.error('Σφάλμα διαγραφής υπηρεσίας:', error);
        setError('Σφάλμα κατά τη διαγραφή');
      }
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Φιλτράρισμα υπηρεσιών
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.scooter_id?.toString().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = (() => {
      if (filter === 'all') return true;
      if (filter === 'completed') return service.status === 'Ολοκληρώθηκε';
      if (filter === 'pending') return service.status !== 'Ολοκληρώθηκε';
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
            <p className="mt-3 text-muted">Φόρτωση υπηρεσιών...</p>
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
            <i className="fas fa-tools text-primary me-3"></i>
            Διαχείριση Υπηρεσιών
          </h1>
          <p className="text-muted mb-0">Διαχειριστείτε όλες τις υπηρεσίες σκούτερ</p>
        </div>
        <Link href="/servicespage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
          <i className="fas fa-plus me-2"></i>Νέα Υπηρεσία
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
                  placeholder="Αναζήτηση τύπου υπηρεσίας, σκούτερ ID..."
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
                  <i className="fas fa-list me-1"></i> Όλες
                </button>
                <button 
                  type="button" 
                  className={`btn hover-btn ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('completed')}
                >
                  <i className="fas fa-check-circle me-1"></i> Ολοκληρωμένες
                </button>
                <button 
                  type="button" 
                  className={`btn hover-btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('pending')}
                >
                  <i className="fas fa-clock me-1"></i> Εκκρεμείς
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-5">
          <div className="modern-card">
            <div className="card-body p-5">
              <div className="empty-state">
                <i className="fas fa-tools text-muted mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                <h4 className="text-muted mb-3">Δεν βρέθηκαν υπηρεσίες</h4>
                <p className="text-muted mb-4">
                  {searchTerm || filter !== 'all' 
                    ? "Δεν υπάρχουν υπηρεσίες που να ταιριάζουν με τα κριτήρια αναζήτησης."
                    : "Δεν υπάρχουν καταχωρημένες υπηρεσίες ακόμη."
                  }
                </p>
                <Link href="/servicespage/new" className="btn btn-modern btn-modern-primary btn-lg hover-lift">
                  <i className="fas fa-plus me-2"></i>Προσθέστε την πρώτη υπηρεσία
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="services-container row g-3">
          {filteredServices.map((service, index) => (
            <div key={service.id} className="col-sm-6 col-lg-4 col-xl-3 stagger-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="service-card modern-card hover-lift h-100" style={{ minHeight: '280px' }}>
              <div className="card-header bg-white border-0 pb-2">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0 text-dark">
                      <i className="fas fa-tools text-primary me-2"></i>
                      {service.service_type}
                    </h6>
                    <span className={`status-badge ${service.status === 'Ολοκληρώθηκε' ? 'status-active' : 'status-pending'}`}>
                      {service.status === 'Ολοκληρώθηκε' ? 'Ολοκληρώθηκε' : 'Εκκρεμής'}
                    </span>
                </div>
              </div>
              <div className="card-body">
                <div className="service-info mb-3">
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-motorcycle text-info me-2"></i>
                        <small className="text-muted fw-semibold">ΣΚΟΥΤΕΡ ID</small>
                      </div>
                      <div className="fw-bold">#{service.scooter_id}</div>
                    </div>
                    
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-calendar text-warning me-2"></i>
                        <small className="text-muted fw-semibold">ΗΜΕΡΟΜΗΝΙΑ</small>
                      </div>
                      <div className="fw-bold">{new Date(service.date).toLocaleDateString('el-GR')}</div>
                    </div>
                    
                    <div className="info-item mb-3">
                      <div className="info-header d-flex align-items-center mb-1">
                        <i className="fas fa-euro-sign text-success me-2"></i>
                        <small className="text-muted fw-semibold">ΚΟΣΤΟΣ</small>
                      </div>
                      <div className="fw-bold text-success fs-5">€{service.cost}</div>
                    </div>

                    {service.description && (
                      <div className="info-item mb-3">
                        <div className="info-header d-flex align-items-center mb-1">
                          <i className="fas fa-file-text text-secondary me-2"></i>
                          <small className="text-muted fw-semibold">ΠΕΡΙΓΡΑΦΗ</small>
                        </div>
                        <div className="text-muted small">{service.description}</div>
                      </div>
                    )}
                </div>
              </div>
              <div className="card-footer bg-white border-0">
                <div className="d-grid gap-2">
                  <div className="btn-group">
                    <Link
                      href={`/servicespage/edit/${service.id}`}
                      className="btn btn-outline-primary hover-btn"
                    >
                      <i className="fas fa-edit me-2"></i>Επεξεργασία
                    </Link>
                    <button
                      className="btn btn-outline-danger hover-btn"
                      onClick={() => deleteService(service.id)}
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
      {services.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="modern-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="fas fa-chart-bar text-primary me-2"></i>
                  Στατιστικά Υπηρεσιών
                </h5>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-tools text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">{services.length}</h3>
                      <small className="text-white opacity-75">Συνολικές Υπηρεσίες</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-check-circle text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {services.filter(s => s.status === 'Ολοκληρώθηκε').length}
                      </h3>
                      <small className="text-white opacity-75">Ολοκληρωμένες</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-clock text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        {services.filter(s => s.status !== 'Ολοκληρώθηκε').length}
                      </h3>
                      <small className="text-white opacity-75">Εκκρεμείς</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card text-center p-3 rounded-3" style={{ background: 'linear-gradient(135deg, #26D0CE 0%, #1A2C5B 100%)' }}>
                      <div className="stat-icon mb-2">
                        <i className="fas fa-euro-sign text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-1">
                        €{services.reduce((sum, s) => sum + (parseFloat(s.cost) || 0), 0).toFixed(2)}
                      </h3>
                      <small className="text-white opacity-75">Συνολικό Κόστος</small>
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
};

export default ServiceList;
