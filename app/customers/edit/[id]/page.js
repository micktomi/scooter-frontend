import { redirect } from 'next/navigation';

export default function LegacyCustomerEditRedirect({ params }) {
  const { id } = params || {};
  redirect(`/customerpage/edit/${id}`);
}

