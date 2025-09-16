import ScooterForm from '../../../components/Scooter/ScooterForm';
import PageHeader from '../../../components/Common/PageHeader';

export default function NewScooterPage() {
  return (
    <div className="container fade-in">
      <PageHeader 
        title="Νέο Σκούτερ" 
        subtitle="Καταχωρήστε ένα νέο σκούτερ στο σύστημα"
        icon="fas fa-motorcycle"
      />
      <ScooterForm />
    </div>
  );
}
