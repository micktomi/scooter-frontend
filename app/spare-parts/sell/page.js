"use client";
import SparePartSale from '../../../components/SpareParts/SparePartSale';
import PageHeader from '../../../components/Common/PageHeader';

export default function SparePartsSellPage() {
  return (
    <div className="container fade-in">
      <PageHeader 
        title="Πώληση Ανταλλακτικού" 
        subtitle="Καταγράψτε μια νέα πώληση ανταλλακτικού"
        icon="bi bi-cart-plus"
      />
      <div className="modern-card">
        <div className="card-body p-4">
          <SparePartSale />
        </div>
      </div>
    </div>
  );
}
