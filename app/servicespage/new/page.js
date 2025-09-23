import ServiceForm from '../../../components/Service/ServiceForm';
import PageHeader from '../../../components/Common/PageHeader';

export default function NewServicePage() {
  return (
    <div className="container fade-in">
      <PageHeader 
        title="Νέα Υπηρεσία" 
        subtitle="Καταχωρήστε μια νέα υπηρεσία"
        icon="bi bi-wrench-adjustable"
      />
      <ServiceForm />
    </div>
  );
}
