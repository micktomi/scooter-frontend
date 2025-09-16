import RentalForm from '../../../components/Rental/RentalForm';
import PageHeader from '../../../components/Common/PageHeader';

export default function NewRentalPage() {
  return (
    <div className="container fade-in">
      <PageHeader 
        title="Νέα Ενοικίαση" 
        subtitle="Καταχωρήστε νέα ενοικίαση σκούτερ"
        icon="fas fa-receipt"
      />
      <RentalForm />
    </div>
  );
}
