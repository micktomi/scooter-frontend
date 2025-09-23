"use client";
import ServiceForm from '../../../../components/Service/ServiceForm';
import { useParams } from 'next/navigation';
import PageHeader from '../../../../components/Common/PageHeader';

export default function EditServicePage() {
  const { id } = useParams();

  return (
    <div className="container fade-in">
      <PageHeader 
        title="Επεξεργασία Υπηρεσίας" 
        subtitle={`Τροποποίηση στοιχείων υπηρεσίας #${id}`}
        icon="bi bi-wrench-adjustable"
      />
      <ServiceForm serviceId={id} />
    </div>
  );
}
