"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "../../../lib/services/api";

export default function SparePartViewPage({ params }) {
  const { id } = use(params);
  const [sparePart, setSparePart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSparePart() {
      try {
        const response = await apiClient.get(`/spare-parts/${id}`);
        setSparePart(response.data);
      } catch (err) {
        setError("Σφάλμα κατά τη φόρτωση των λεπτομερειών του ανταλλακτικού.");
      } finally {
        setLoading(false);
      }
    }
    fetchSparePart();
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

  if (!sparePart) return null;

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
          <Link href="/sparepartspage" className="btn btn-secondary me-2">Επιστροφή</Link>
          <Link href={`/spare-parts/edit/${id}`} className="btn btn-primary">Επεξεργασία</Link>
        </div>
      </div>
    </div>
  );
}
