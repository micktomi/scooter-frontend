"use client";
import RentalForm from '../../../../components/Rental/RentalForm';
import { useParams } from 'next/navigation';
import PageHeader from '../../../../components/Common/PageHeader';

export default function EditRentalPage() {
  const { id } = useParams();

  return (
    <div className="container fade-in">
      <PageHeader 
        title="Επεξεργασία Ενοικίασης" 
        subtitle={`Τροποποίηση στοιχείων ενοικίασης #${id}`}
        icon="fas fa-receipt"
      />
      <RentalForm rentalId={id} />
    </div>
  );
}
