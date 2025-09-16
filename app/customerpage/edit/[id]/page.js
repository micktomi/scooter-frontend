"use client";
import CustomerForm from "../../../../components/Customer/CustomerForm";
import { useParams } from 'next/navigation';
import PageHeader from "../../../../components/Common/PageHeader";

export default function EditCustomerPage() {
  const { id } = useParams();

  return (
    <div className="container fade-in">
      <PageHeader 
        title="Επεξεργασία Πελάτη" 
        subtitle={`Τροποποίηση στοιχείων για πελάτη #${id}`}
        icon="fas fa-user"
      />
      <CustomerForm customerId={id} />
    </div>
  );
}
