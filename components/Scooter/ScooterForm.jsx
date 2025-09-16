"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/services/api';

function ScooterForm({ scooterId }) {
 const router = useRouter();
 const [formData, setFormData] = useState({
   plate: '',
   brand: '',
   model: '',
   year: '',
   price: '',
   description: '',
   condition: 'Μεταχειρισμένο',
   is_sold: false,
   sold_date: '',
   sold_to_customer_id: '',
   purchase_price: '',
   selling_price: ''
 });
 
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [customers, setCustomers] = useState([]);
 
 // Έλεγχος αν ένα σκούτερ ήταν ήδη πωλημένο
 const checkIfSoldBefore = async (scooterID) => {
   try {
     const response = await apiClient.get(`/scooters/${scooterID}`);
     return response.data.is_sold;
   } catch (error) {
     console.error('Error checking scooter status:', error);
     return false;
   }
 };

 // Φόρτωση λίστας πελατών
 useEffect(() => {
   const fetchCustomers = async () => {
     try {
       const response = await apiClient.get('/customers/');
       setCustomers(response.data);
     } catch (error) {
       console.error('Error fetching customers:', error);
     }
   };
   
   fetchCustomers();
 }, []);

 // Φόρτωση δεδομένων αν υπάρχει ID (edit mode)
 useEffect(() => {
  if (scooterId) {
    const fetchScooter = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/scooters/${scooterId}`);
        const d = response.data || {};
        // Κανονικοποίηση για controlled inputs (όχι null/undefined)
        setFormData({
          plate: d.plate || '',
          brand: d.brand || '',
          model: d.model || '',
          year: d.year != null ? String(d.year) : '',
          price: d.price != null ? String(d.price) : '',
          description: d.description || '',
          condition: d.condition || 'Μεταχειρισμένο',
          is_sold: Boolean(d.is_sold),
          sold_date: d.sold_date || '',
          sold_to_customer_id: d.sold_to_customer_id != null ? String(d.sold_to_customer_id) : '',
          purchase_price: d.purchase_price != null ? String(d.purchase_price) : '',
          selling_price: d.selling_price != null ? String(d.selling_price) : ''
        });
      } catch (error) {
        setError('Σφάλμα φόρτωσης δεδομένων σκούτερ.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
     
     fetchScooter();
   }
 }, [scooterId]);

 const handleChange = (e) => {
   const { name, value, type, checked } = e.target;
   setFormData({
     ...formData,
     [name]: type === 'checkbox' ? checked : value
   });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  // Αποθηκεύουμε την αρχική κατάσταση πώλησης για να ελέγξουμε αν άλλαξε
  const was_sold_before = scooterId ? await checkIfSoldBefore(scooterId) : false;
  
  // Δημιουργούμε ένα νέο αντικείμενο με τις σωστά διαμορφωμένες τιμές
  const submitData = {
    plate: formData.plate || undefined,
    brand: formData.brand,
    model: formData.model,
    year: formData.year ? parseInt(formData.year) : undefined,
    price: formData.price ? parseFloat(formData.price) : undefined,
    description: formData.description || undefined,
    condition: formData.condition,
    is_sold: Boolean(formData.is_sold),
    sold_date: formData.sold_date || undefined,
    sold_to_customer_id: formData.sold_to_customer_id ? parseInt(formData.sold_to_customer_id) : undefined,
    purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
    selling_price: formData.selling_price ? parseFloat(formData.selling_price) : undefined
  };
  
  try {
    let response;
    if (scooterId) {
      response = await apiClient.put(`/scooters/${scooterId}`, submitData);
    } else {
      response = await apiClient.post('/scooters/', submitData);
    }
    
    console.log('Success:', response.data);
    
    // Η δημιουργία συναλλαγής πώλησης γίνεται αποκλειστικά στο backend
    
    router.push('/scooterpage');
  } catch (error) {
    setError(`Σφάλμα κατά την ${scooterId ? 'επεξεργασία' : 'προσθήκη'} του σκούτερ.`);
    console.error('Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  } finally {
    setLoading(false);
  }
};

 return (
   <div className="container fade-in">
     <div className="row justify-content-center">
       <div className="col-md-10 col-lg-8">
         <div className="modern-card hover-lift">
           <div className="card-header bg-white border-0">
             <h2 className="card-title mb-0 text-dark">
               <i className="fas fa-motorcycle text-primary me-2"></i>
               {scooterId ? 'Επεξεργασία' : 'Προσθήκη Νέου'} Σκούτερ
             </h2>
           </div>
           <div className="card-body p-4">
             {error && (
               <div className="alert alert-danger" role="alert">
                 {error}
               </div>
             )}
             
             <form onSubmit={handleSubmit}>
               <div className="mb-3">
                 <label htmlFor="brand" className="form-label">Μάρκα:</label>
                 <input 
                   type="text" 
                   className="form-control"
                   id="brand"
                   name="brand" 
                   value={formData.brand} 
                   onChange={handleChange} 
                   required 
                 />
               </div>
               
               <div className="mb-3">
                 <label htmlFor="plate" className="form-label">Πινακίδα (προαιρετικό):</label>
                 <input 
                   type="text" 
                   className="form-control"
                   id="plate"
                   name="plate" 
                   value={formData.plate}
                   onChange={handleChange}
                 />
               </div>

               <div className="mb-3">
                 <label className="form-label">Κατάσταση:</label>
                 <div className="form-check">
                   <input
                     type="radio"
                     className="form-check-input"
                     id="conditionNew"
                     name="condition"
                     value="Καινούργιο"
                     checked={formData.condition === "Καινούργιο"}
                     onChange={handleChange}
                   />
                   <label className="form-check-label" htmlFor="conditionNew">
                     Καινούργιο
                   </label>
                 </div>
                 <div className="form-check">
                   <input
                     type="radio"
                     className="form-check-input"
                     id="conditionUsed"
                     name="condition"
                     value="Μεταχειρισμένο"
                     checked={formData.condition === "Μεταχειρισμένο"}
                     onChange={handleChange}
                   />
                   <label className="form-check-label" htmlFor="conditionUsed">
                     Μεταχειρισμένο
                   </label>
                 </div>
               </div>
               
               <div className="mb-3">
                 <label htmlFor="model" className="form-label">Μοντέλο:</label>
                 <input 
                   type="text" 
                   className="form-control"
                   id="model"
                   name="model" 
                   value={formData.model} 
                   onChange={handleChange} 
                   required 
                 />
               </div>
               
               <div className="mb-3">
                 <label htmlFor="year" className="form-label">Έτος:</label>
                 <input 
                   type="number" 
                   className="form-control"
                   id="year"
                   name="year" 
                   value={formData.year} 
                   onChange={handleChange} 
                 />
               </div>
               
               <div className="mb-3">
                 <label htmlFor="price" className="form-label">Τιμή (€):</label>
                 <input 
                   type="number" 
                   className="form-control"
                   id="price"
                   name="price" 
                   value={formData.price} 
                   onChange={handleChange} 
                 />
               </div>
               
               <div className="mb-3">
                 <label htmlFor="description" className="form-label">Περιγραφή:</label>
                 <textarea 
                   className="form-control"
                   id="description"
                   name="description" 
                   value={formData.description} 
                   onChange={handleChange} 
                   rows="4"
                 ></textarea>
               </div>

               <hr className="my-4" />
               <h4>Στοιχεία Πώλησης</h4>
               
               <div className="mb-3 form-check">
                 <input
                   type="checkbox"
                   className="form-check-input"
                   id="is_sold"
                   name="is_sold"
                   checked={formData.is_sold}
                   onChange={handleChange}
                 />
                 <label className="form-check-label" htmlFor="is_sold">
                   Έχει πουληθεί
                 </label>
               </div>
               
               {formData.is_sold && (
                 <>
                   <div className="mb-3">
                     <label htmlFor="sold_date" className="form-label">Ημερομηνία Πώλησης:</label>
                     <input 
                       type="date" 
                       className="form-control"
                       id="sold_date"
                       name="sold_date" 
                       value={formData.sold_date} 
                       onChange={handleChange} 
                     />
                   </div>
                   
                   <div className="mb-3">
                     <label htmlFor="sold_to_customer_id" className="form-label">Πωλήθηκε σε:</label>
                     <select
                       className="form-select"
                       id="sold_to_customer_id"
                       name="sold_to_customer_id"
                       value={formData.sold_to_customer_id}
                       onChange={handleChange}
                     >
                       <option value="">Επιλέξτε Πελάτη</option>
                       {customers.map(customer => (
                         <option key={customer.id} value={customer.id}>
                           {customer.name} {customer.phone && `- ${customer.phone}`}
                         </option>
                       ))}
                     </select>
                   </div>
                 </>
               )}
               
               <div className="mb-3">
                 <label htmlFor="purchase_price" className="form-label">Τιμή Αγοράς (€):</label>
                 <input 
                   type="number" 
                   step="0.01"
                   className="form-control"
                   id="purchase_price"
                   name="purchase_price" 
                   value={formData.purchase_price} 
                   onChange={handleChange} 
                 />
               </div>
               
               <div className="mb-3">
                 <label htmlFor="selling_price" className="form-label">Τιμή Πώλησης (€):</label>
                 <input 
                   type="number" 
                   step="0.01"
                   className="form-control"
                   id="selling_price"
                   name="selling_price" 
                   value={formData.selling_price} 
                   onChange={handleChange} 
                 />
               </div>
               
               <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                 <button 
                   type="button" 
                   className="btn btn-outline-secondary hover-btn me-md-2" 
                   onClick={() => navigate('/scooters')}
                   disabled={loading}
                 >
                   Ακύρωση
                 </button>
                 <button 
                   type="submit" 
                   className="btn btn-modern btn-modern-primary"
                   disabled={loading}
                 >
                   {loading ? (
                     <>
                       <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                       <span className="ms-2">Αποθήκευση...</span>
                     </>
                   ) : 'Αποθήκευση'}
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}

export default ScooterForm;
