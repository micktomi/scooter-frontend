"use client";
import ScooterForm from '../../../../components/Scooter/ScooterForm';
import { useParams } from 'next/navigation';
import PageHeader from '../../../../components/Common/PageHeader';

export default function EditScooterPage() {
  const { id } = useParams();

  return (
    <div className="container fade-in">
      <PageHeader 
        title="Επεξεργασία Σκούτερ" 
        subtitle={`Τροποποίηση στοιχείων για σκούτερ #${id}`}
        icon="fas fa-motorcycle"
      />
      <ScooterForm scooterId={id} />
    </div>
  );
}
