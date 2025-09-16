"use client";
import SparePartForm from '../../../components/SpareParts/SparePartForm';
import PageHeader from '../../../components/Common/PageHeader';

export default function SparePartNewPage() {
  return (
    <div className="container fade-in">
      <PageHeader 
        title="Νέο Ανταλλακτικό" 
        subtitle="Καταχωρήστε νέο ανταλλακτικό και τιμές"
        icon="bi bi-nut"
      />
      <SparePartForm />
    </div>
  );
}
