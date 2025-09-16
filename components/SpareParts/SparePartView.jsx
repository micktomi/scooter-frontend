import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/services/api';

function SparePartView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sparePart, setSparePartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSparePartDetails = async () => {
      try {
        const response = await apiClient.get(`/spare-parts/${id}`);
        setSparePartData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Σφάλμα κατά τη φόρτωση των λεπτομερειών του ανταλλακτικού.');
        console.error('Error fetching spare part details:', err);
        setLoading(false);
      }
    };

    fetchSparePartDetails();
  }, [id]);

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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Λεπτομέρειες Ανταλλακτικού</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h4>{sparePart.name}</h4>
              <p><strong>Κωδικός:</strong> {sparePart.code || 'Δ/Υ'}</p>
              <p><strong>Κατηγορία:</strong> {sparePart.category || 'Δ/Υ'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Τιμή Αγοράς:</strong> {sparePart.purchase_price ? `${sparePart.purchase_price}€` : 'Δ/Υ'}</p>
              <p><strong>Τιμή Πώλησης:</strong> {sparePart.selling_price ? `${sparePart.selling_price}€` : 'Δ/Υ'}</p>
              <p><strong>Απόθεμα:</strong> {sparePart.stock}</p>
              <p><strong>Ελάχιστο Απόθεμα:</strong> {sparePart.min_stock}</p>
            </div>
          </div>
          {sparePart.description && (
            <div className="mt-3">
              <strong>Περιγραφή:</strong>
              <p>{sparePart.description}</p>
            </div>
          )}
        </div>
        <div className="card-footer">
          <Link to="/spare-parts" className="btn btn-secondary me-2">Επιστροφή</Link>
          <Link to={`/spare-parts/edit/${id}`} className="btn btn-primary">Επεξεργασία</Link>
        </div>
      </div>
    </div>
  );
}

export default SparePartView;
