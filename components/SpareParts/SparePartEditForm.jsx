import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/services/api';

function SparePartEditForm({ sparePartId }) {
  const router = useRouter();
  const id = sparePartId;
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    purchase_price: '',
    selling_price: '',
    stock: 0,
    min_stock: 1,
    description: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSparePartDetails = async () => {
      try {
        const response = await apiClient.get(`/spare-parts/${id}`);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Σφάλμα φόρτωσης δεδομένων ανταλλακτικού.');
        console.error('Error:', err);
        setLoading(false);
      }
    };

    fetchSparePartDetails();
  }, [id]);

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
      const response = await apiClient.put(`/spare-parts/${id}`, formData);
      console.log('Success:', response.data);
      router.push('/sparepartspage'); // Επιστροφή στη λίστα ανταλλακτικών
    } catch (error) {
      setError('Σφάλμα κατά την επεξεργασία του ανταλλακτικού.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Φόρτωση...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <i className="bi bi-nut me-2"></i>
              <h2 className="card-title mb-0">Επεξεργασία Ανταλλακτικού</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Όνομα:</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="name"
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">Κωδικός Κατασκευαστή:</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="code"
                    name="code" 
                    value={formData.code} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Κατηγορία:</label>
                  <select 
                    className="form-select"
                    id="category"
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                  >
                    <option value="">Επιλέξτε Κατηγορία</option>
                    <option value="Ελαστικά">Ελαστικά</option>
                    <option value="Λάδια">Λάδια</option>
                    <option value="Φίλτρα">Φίλτρα</option>
                    <option value="Μπαταρίες">Μπαταρίες</option>
                    <option value="Αναλώσιμα">Αναλώσιμα</option>
                    <option value="Άλλο">Άλλο</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="purchase_price" className="form-label">Τιμή Αγοράς (€):</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control"
                    id="purchase_price"
                    name="purchase_price" 
                    value={formData.purchase_price} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="selling_price" className="form-label">Τιμή Πώλησης (€):</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control"
                    id="selling_price"
                    name="selling_price" 
                    value={formData.selling_price} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">Απόθεμα:</label>
                  <input 
                    type="number" 
                    className="form-control"
                    id="stock"
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="min_stock" className="form-label">Ελάχιστο Απόθεμα:</label>
                  <input 
                    type="number" 
                    className="form-control"
                    id="min_stock"
                    name="min_stock" 
                    value={formData.min_stock} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Περιγραφή:</label>
                  <textarea 
                    className="form-control"
                    id="description"
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2" 
                    onClick={() => navigate('/spare-parts')}
                    disabled={loading}
                  >
                    Ακύρωση
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
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

export default SparePartEditForm;
