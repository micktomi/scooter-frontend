"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/services/api';

function CustomerForm({ customerId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Φόρτωση δεδομένων πελάτη αν είμαστε σε edit mode
  useEffect(() => {
    if (customerId) {
      const fetchCustomer = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/customers/${customerId}`);
          setForm(response.data);
        } catch (err) {
          console.error(err);
          alert('Σφάλμα φόρτωσης δεδομένων πελάτη');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCustomer();
    }
  }, [customerId]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Το όνομα είναι υποχρεωτικό';
    if (!form.phone.trim()) newErrors.phone = 'Το τηλέφωνο είναι υποχρεωτικό';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Μη έγκυρο email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        if (customerId) {
          // Ενημέρωση υπάρχοντος πελάτη
          await apiClient.put(`/customers/${customerId}`, form);
          alert('Ο πελάτης ενημερώθηκε!');
        } else {
          // Δημιουργία νέου πελάτη
          await apiClient.post('/customers', form);
          alert('Ο πελάτης προστέθηκε!');
        }
        router.push('/customerpage');
      } catch (err) {
        console.error(err);
        alert('Σφάλμα καταχώρησης');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="container fade-in">
      <div className="modern-card hover-lift">
        <div className="card-header bg-white border-0">
          <h3 className="mb-0 text-dark">
            <i className="fas fa-user text-primary me-2"></i>
            {customerId ? 'Επεξεργασία' : 'Καταχώρηση'} Πελάτη
          </h3>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Όνομα:</label>
              <input 
                type="text"
                className="form-control"
                id="name"
                name="name" 
                placeholder="Όνομα" 
                value={form.name}
                onChange={handleChange} 
              />
              {errors.name && <p className="text-danger">{errors.name}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Τηλέφωνο:</label>
              <input 
                type="text"
                className="form-control"
                id="phone"
                name="phone" 
                placeholder="Τηλέφωνο" 
                value={form.phone}
                onChange={handleChange} 
              />
              {errors.phone && <p className="text-danger">{errors.phone}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input 
                type="email"
                className="form-control"
                id="email"
                name="email" 
                placeholder="Email" 
                value={form.email}
                onChange={handleChange} 
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary hover-btn me-2" 
                onClick={() => router.push('/customerpage')}
                disabled={loading}
              >
                Ακύρωση
              </button>
              <button 
                type="submit" 
                className="btn btn-modern btn-modern-primary"
                disabled={loading}
              >
                {loading ? 'Επεξεργασία...' : (customerId ? 'Ενημέρωση' : 'Καταχώρηση')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;
