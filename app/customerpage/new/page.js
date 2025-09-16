import CustomerForm from "../../../components/Customer/CustomerForm";
import PageHeader from "../../../components/Common/PageHeader";

export default function NewCustomerPage() {
  return (
    <div className="container fade-in">
      <PageHeader 
        title="Νέος Πελάτης" 
        subtitle="Καταχωρήστε έναν νέο πελάτη"
        icon="fas fa-user"
      />
      <CustomerForm />
    </div>
  );
}
