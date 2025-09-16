"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/services/api';

function SparePartSale() {
  const router = useRouter();
  const [spareParts, setSpareParts] = useState([]);
  const [formData, setFormData] = useState({
    spare_part_id: '',
    quantity: 1,
    sale_price: '',
    customer_name: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingParts, setLoadingParts] = useState(true);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await apiClient.get('/spare-parts/');
        setSpareParts(response.data.filter(part => part.stock > 0));
      } catch (error) {
        setError('Σφάλμα κατά τη φόρτωση των ανταλλακτικών.');
        console.error('Error fetching spare parts:', error);
      } finally {
        setLoadingParts(false);
      }
    };

    fetchSpareParts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'spare_part_id' && value) {
      const selectedPart = spareParts.find(part => part.id === parseInt(value));
      if (selectedPart) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          sale_price: selectedPart.selling_price || ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const processedData = {
      spare_part_id: parseInt(formData.spare_part_id),
      quantity: parseInt(formData.quantity),
      sale_price: parseFloat(formData.sale_price),
      customer_name: formData.customer_name || undefined,
      notes: formData.notes || undefined
    };

    try {
      const response = await apiClient.post('/spare-parts/sell', processedData);
      console.log('Success:', response.data);
      router.push('/sparepartspage');
    } catch (error) {
      setError('Σφάλμα κατά την καταγραφή της πώλησης.');
      console.error('Error:', error);
      if (error.response && error.response.data) {
        console.error('API Error details:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingParts) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const selectedPart = spareParts.find(part => part.id === parseInt(formData.spare_part_id));

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h2 className="card-title mb-0">Πώληση Ανταλλακτικού</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="spare_part_id" className="form-label">Ανταλλακτικό:</label>
                  <select 
                    className="form-select"
                    id="spare_part_id"
                    name="spare_part_id" 
                    value={formData.spare_part_id} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Επιλέξτε Ανταλλακτικό</option>
                    {spareParts.map(part => (
                      <option key={part.id} value={part.id}>
                        {part.name} - {part.code} (Απόθεμα: {part.stock})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPart && (
                  <div className="alert alert-info">
                    <strong>Επιλεγμένο:</strong> {selectedPart.name}<br/>
                    <strong>Κωδικός:</strong> {selectedPart.code}<br/>
                    <strong>Διαθέσιμο απόθεμα:</strong> {selectedPart.stock}<br/>
                    <strong>Προτεινόμενη τιμή:</strong> €{selectedPart.selling_price}
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Ποσότητα:</label>
                  <input 
                    type="number" 
                    min="1"
                    max={selectedPart ? selectedPart.stock : 1}
                    className="form-control"
                    id="quantity"
                    name="quantity" 
                    value={formData.quantity} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="sale_price" className="form-label">Τιμή Πώλησης (€):</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="form-control"
                    id="sale_price"
                    name="sale_price" 
                    value={formData.sale_price} 
                    onChange={handleChange} 
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="customer_name" className="form-label">Όνομα Πελάτη (προαιρετικό):</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="customer_name"
                    name="customer_name" 
                    value={formData.customer_name} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Σημειώσεις (προαιρετικό):</label>
                  <textarea 
                    className="form-control"
                    id="notes"
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange} 
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2" 
                    onClick={() => router.push('/sparepartspage')}
                    disabled={loading}
                  >
                    Ακύρωση
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={loading || !formData.spare_part_id}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">Καταγραφή...</span>
                      </>
                    ) : 'Καταγραφή Πώλησης'}
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

export default SparePartSale;
