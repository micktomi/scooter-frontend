"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/services/api';

function ServiceForm({ serviceId }) {
  const router = useRouter();
  const [scooters, setScooters] = useState([]);
  const [formData, setFormData] = useState({
    scooter_info: '',
    service_type: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    status: 'Σε εξέλιξη'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Φόρτωση λίστας σκούτερ κατά την αρχικοποίηση
  useEffect(() => {
    const fetchScooters = async () => {
      try {
        const response = await apiClient.get('/scooters/');
        const data = response.data;
        setScooters(data);
      } catch (error) {
        console.error('Σφάλμα:', error);
        setError('Αδυναμία φόρτωσης σκούτερ');
      }
    };

    fetchScooters();
  }, []);

  // Φόρτωση υπηρεσίας αν είμαστε σε edit mode
  useEffect(() => {
    if (serviceId) {
      const fetchService = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/services/${serviceId}`);
          const data = response.data;
          setFormData({
            scooter_info: data.scooter_info || '',
            service_type: data.service_type || '',
            description: data.description || '',
            date: data.date || new Date().toISOString().split('T')[0],
            cost: data.cost || '',
            status: data.status || 'Σε εξέλιξη'
          });
        } catch (error) {
          console.error('Σφάλμα:', error);
          setError('Αδυναμία φόρτωσης υπηρεσίας');
        } finally {
          setLoading(false);
        }
      };
      
      fetchService();
    }
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        scooter_info: formData.scooter_info,
        service_type: formData.service_type,
        description: formData.description,
        date: formData.date,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        status: formData.status
      };

      const response = serviceId
        ? await apiClient.put(`/services/${serviceId}`, payload)
        : await apiClient.post('/services/', payload);

      const responseData = response.data;
      console.log(`Επιτυχής ${serviceId ? 'ενημέρωση' : 'προσθήκη'} υπηρεσίας:`, responseData);
      
      // Ενημερώνουμε το localStorage ότι έγινε νέα συναλλαγή - χρήσιμο για την οικονομική ανάλυση
      if (formData.cost && parseFloat(formData.cost) > 0) {
        localStorage.setItem('newFinancialTransaction', 'true');
        localStorage.setItem('lastFinancialUpdate', new Date().toISOString());
      }
      
      router.push('/servicespage');
    } catch (error) {
      setError(error.message);
      console.error('Σφάλμα:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="modern-card hover-lift">
            <div className="card-header bg-white border-0">
              <h2 className="card-title mb-0 text-dark">
                <i className="fas fa-tools text-primary me-2"></i>
                {serviceId ? 'Επεξεργασία' : 'Προσθήκη Νέας'} Υπηρεσίας
              </h2>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="scooter_info" className="form-label">Στοιχεία Σκούτερ:</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="scooter_info"
                    name="scooter_info" 
                    value={formData.scooter_info} 
                    onChange={handleChange}
                    placeholder="π.χ. ΚΗΗ-1234 ή Yamaha Crypton μπλε"
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="service_type" className="form-label">Τύπος Υπηρεσίας:</label>
                  <select
                    className="form-select"
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Επιλέξτε Τύπο Υπηρεσίας</option>
                    <option value="Τακτικό Service">Τακτικό Service</option>
                    <option value="Επισκευή Βλάβης">Επισκευή Βλάβης</option>
                    <option value="Αλλαγή Λαδιών">Αλλαγή Λαδιών</option>
                    <option value="Αλλαγή Ελαστικών">Αλλαγή Ελαστικών</option>
                    <option value="Έλεγχος">Έλεγχος</option>
                    <option value="Άλλο">Άλλο</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Περιγραφή Βλάβης:</label>
                  <textarea 
                    className="form-control"
                    id="description"
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="4"
                    placeholder="Περιγράψτε λεπτομερώς το πρόβλημα"
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">Ημερομηνία:</label>
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
                
                <div className="mb-3">
                  <label htmlFor="cost" className="form-label">Κόστος (€):</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control"
                    id="cost"
                    name="cost" 
                    value={formData.cost} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Κατάσταση:</label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Σε εξέλιξη">Σε εξέλιξη</option>
                    <option value="Ολοκληρώθηκε">Ολοκληρώθηκε</option>
                    <option value="Ακυρώθηκε">Ακυρώθηκε</option>
                    <option value="Αναμονή ανταλλακτικών">Αναμονή ανταλλακτικών</option>
                  </select>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary hover-btn me-md-2" 
                    onClick={() => router.push('/servicespage')}
                    disabled={loading}
                  >
                    Ακύρωση
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-modern btn-modern-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">Αποθήκευση...</span>
                      </>
                    ) : 'Αποθήκευση'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;
