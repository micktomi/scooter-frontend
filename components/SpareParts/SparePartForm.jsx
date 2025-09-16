"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/services/api';

function SparePartForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    purchase_price: '',
    selling_price: '',
    stock: 0,
    min_stock: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    
    // Δημιουργία νέου αντικειμένου με σωστούς τύπους δεδομένων και μόνο τα πεδία του schema
    const processedData = {
      name: formData.name,
      code: formData.code || undefined,
      category: formData.category || undefined,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
      selling_price: formData.selling_price ? parseFloat(formData.selling_price) : undefined,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      min_stock: formData.min_stock ? parseInt(formData.min_stock) : 5
    };
    try {
      const response = await apiClient.post('/spare-parts/', processedData);
      console.log('Success:', response.data);
      router.push('/sparepartspage'); // Επιστροφή στη λίστα ανταλλακτικών
    } catch (error) {
      setError('Σφάλμα κατά την προσθήκη του ανταλλακτικού.');
      console.error('Error:', error);
      if (error.response && error.response.data) {
        console.error('API Error details:', error.response.data);
      }
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
                <i className="bi bi-nut text-primary me-2"></i>
                Προσθήκη Νέου Ανταλλακτικού
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
                  {/* Περιγραφή: Το backend schema δεν το περιλαμβάνει, αν το προσθέσεις στο backend, ξεκλείδωσε το παρακάτω */}
                  {/*
                  <label htmlFor="description" className="form-label">Περιγραφή:</label>
                  <textarea 
                    className="form-control"
                    id="description"
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="3"
                  ></textarea>
                  */}
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary hover-btn me-md-2" 
                    onClick={() => router.push('/sparepartspage')}
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

export default SparePartForm;
