"use client";

import { use } from "react";
import SparePartEditForm from '../../../../components/SpareParts/SparePartEditForm';
import PageHeader from '../../../../components/Common/PageHeader';

export default function SparePartEditPage({ params }) {
  const { id } = use(params);

  return (
    <div className="container fade-in">
      <PageHeader 
        title="Επεξεργασία Ανταλλακτικού" 
        subtitle="Ενημερώστε τα στοιχεία του ανταλλακτικού"
        icon="bi bi-pencil-square"
      />
      <div className="modern-card">
        <div className="card-body p-4">
          <SparePartEditForm sparePartId={id} />
        </div>
      </div>
    </div>
  );
}
