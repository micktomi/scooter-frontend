"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createRental, 
  updateRental, 
  fetchRental, 
  getAvailableScooters, 
  getCustomers,
  calculateRentalCost,
  fetchScooter,
  fetchCustomer
} from '../../lib/services/rentalService';

function RentalForm({ rentalId }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    scooter_id: '',
    customer_id: '',
    start_date: '',
    end_date: '',
    total_price: '',
    status: 'Ενεργή',
    notes: ''
  });
  
  const [loading, setLoading] = useState(true); // Ξεκινάμε με true για τη αρχική φόρτωση
  const [error, setError] = useState(null);
  const [scooters, setScooters] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dailyRate, setDailyRate] = useState(20);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Φόρτωση δεδομένων για τα dropdowns
        const [scootersData, customersData] = await Promise.all([
          getAvailableScooters(),
          getCustomers()
        ]);
        
        let finalScooters = scootersData;
        let finalCustomers = customersData;

        // 2. Αν είμαστε σε κατάσταση επεξεργασίας, φορτώνουμε την ενοικίαση
        if (rentalId) {
          const rental = await fetchRental(rentalId);
          
          // 3. Έλεγχος αν το σκούτερ της ενοικίασης υπάρχει ήδη στη λίστα
          const scooterInList = scootersData.some(s => s.id === rental.scooter_id);
          if (!scooterInList && rental.scooter_id) {
            const rentedScooter = await fetchScooter(rental.scooter_id);
            finalScooters = [...scootersData, rentedScooter];
          }

          // 4. Έλεγχος αν ο πελάτης της ενοικίασης υπάρχει ήδη στη λίστα
          const customerInList = customersData.some(c => c.id === rental.customer_id);
          if (!customerInList && rental.customer_id) {
            const rentalCustomer = await fetchCustomer(rental.customer_id);
            finalCustomers = [...customersData, rentalCustomer];
          }
          
          // 5. Ορισμός των δεδομένων της φόρμας
          setFormData({
            scooter_id: rental.scooter_id || '',
            customer_id: rental.customer_id || '',
            start_date: rental.start_date ? rental.start_date.split('T')[0] : '',
            end_date: rental.end_date ? rental.end_date.split('T')[0] : '',
            total_price: rental.total_price || '',
            status: rental.status || 'Ενεργή',
            notes: rental.notes || ''
          });
        }
        
        setScooters(finalScooters);
        setCustomers(finalCustomers);

      } catch (err) {
        setError('Σφάλμα κατά την προετοιμασία της φόρμας.');
        console.error('Form initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [rentalId]);

  // Αυτόματος υπολογισμός συνολικής τιμής
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const calculatedPrice = calculateRentalCost(
        formData.start_date, 
        formData.end_date, 
        dailyRate
      );
      setFormData(prev => ({
        ...prev,
        total_price: calculatedPrice
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        total_price: ''
      }));
    }
  }, [formData.start_date, formData.end_date, dailyRate]);

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

    // Validation
    if (!formData.scooter_id || !formData.customer_id || !formData.start_date || !formData.end_date) {
      setError('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate <= startDate) {
      setError('Η ημερομηνία λήξης πρέπει να είναι μετά την ημερομηνία έναρξης.');
      setLoading(false);
      return;
    }

    const submitData = {
      scooter_id: parseInt(formData.scooter_id),
      customer_id: parseInt(formData.customer_id),
      start_date: formData.start_date,
      end_date: formData.end_date,
      total_price: parseFloat(formData.total_price) || 0,
      status: formData.status,
      notes: formData.notes || null
    };

    try {
      if (rentalId) {
        await updateRental(rentalId, submitData);
      } else {
        await createRental(submitData);
      }
      
      localStorage.setItem('newFinancialTransaction', 'true');
      localStorage.setItem('lastFinancialUpdate', new Date().toISOString());
      
      router.push('/rentalspage');
    } catch (error) {
      setError(`Σφάλμα κατά την ${rentalId ? 'ενημέρωση' : 'δημιουργία'} της ενοικίασης.`);
      console.error('Error submitting rental:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (end <= start) return 0;
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="loading-spinner-modern loading-spinner"></div>
            <p className="mt-3 text-muted">Φόρτωση δεδομένων φόρμας...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="modern-card hover-lift">
            <div className="card-header bg-white border-0">
              <h2 className="card-title mb-0 text-dark">
                <i className="fas fa-motorcycle text-primary"></i> {' '}
                {rentalId ? 'Επεξεργασία' : 'Νέα'} Ενοικίαση
              </h2>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="scooter_id" className="form-label">
                        Σκούτερ <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="scooter_id"
                        name="scooter_id"
                        value={formData.scooter_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Επιλέξτε Σκούτερ</option>
                        {scooters.map(scooter => (
                          <option key={scooter.id} value={scooter.id}>
                            {scooter.brand} {scooter.model}
                            {scooter.plate && ` (${scooter.plate})`}
                            {scooter.year && ` - ${scooter.year}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="customer_id" className="form-label">
                        Πελάτης <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="customer_id"
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Επιλέξτε Πελάτη</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                            {customer.phone && ` - ${customer.phone}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="start_date" className="form-label">
                        Ημερομηνία Έναρξης <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="end_date" className="form-label">
                        Ημερομηνία Λήξης <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        min={formData.start_date}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Υπολογισμός κόστους */}
                {formData.start_date && formData.end_date && calculateDays() > 0 && (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="alert alert-info">
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <strong>Ημέρες:</strong> {calculateDays()}
                          </div>
                          <div className="col-md-4">
                            <strong>Ημερήσια τιμή:</strong>
                            <div className="input-group input-group-sm mt-1">
                              <span className="input-group-text">€</span>
                              <input
                                type="number"
                                className="form-control"
                                value={dailyRate}
                                onChange={(e) => setDailyRate(parseFloat(e.target.value) || 20)}
                                min="1"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <strong>Συνολικό κόστος:</strong> €{formData.total_price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="total_price" className="form-label">
                        Συνολικό Κόστος (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="total_price"
                        name="total_price"
                        value={formData.total_price}
                        onChange={handleChange}
                        min="0"
                      />
                      <div className="form-text">
                        Το κόστος υπολογίζεται αυτόματα με βάση τις ημερομηνίες
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Κατάσταση</label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Ενεργή">Ενεργή</option>
                        <option value="Ολοκληρωμένη">Ολοκληρωμένη</option>
                        <option value="Ακυρωμένη">Ακυρωμένη</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Σημειώσεις</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Επιπλέον σημειώσεις για την ενοικίαση..."
                  ></textarea>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary hover-btn me-md-2" 
                    onClick={() => navigate('/rentals')}
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
                    ) : (
                      <>
                        <i className="fas fa-save"></i> Αποθήκευση
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Βοήθεια */}
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="modern-card">
            <div className="card-body p-4">
              <h6><i className="fas fa-info-circle"></i> Οδηγίες</h6>
              <ul className="small">
                <li>Επιλέξτε ένα διαθέσιμο σκούτερ από τη λίστα (μη πωλημένα σκούτερ)</li>
                <li>Το συνολικό κόστος υπολογίζεται αυτόματα με βάση τις ημερομηνίες</li>
                <li>Μπορείτε να προσαρμόσετε την ημερήσια τιμή ή το συνολικό κόστος</li>
                <li>Η ενοικίαση θα καταγραφεί αυτόματα στα οικονομικά</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentalForm;
