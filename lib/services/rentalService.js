import { apiClient } from './api';

// Λήψη όλων των ενοικιάσεων
export const fetchRentals = async () => {
  try {
    const response = await apiClient.get('/rentals/');
    return response.data;
  } catch (error) {
    console.error('Σφάλμα κατά την λήψη ενοικιάσεων:', error);
    throw error;
  }
};

// Λήψη μιας ενοικίασης με βάση το ID
export const fetchRental = async (rentalId) => {
  try {
    const response = await apiClient.get(`/rentals/${rentalId}`);
    return response.data;
  } catch (error) {
    console.error(`Σφάλμα κατά την λήψη ενοικίασης ${rentalId}:`, error);
    throw error;
  }
};

// Δημιουργία νέας ενοικίασης
export const createRental = async (rentalData) => {
  try {
    const response = await apiClient.post('/rentals/', rentalData);
    return response.data;
  } catch (error) {
    console.error('Σφάλμα κατά τη δημιουργία ενοικίασης:', error);
    throw error;
  }
};

// Ενημέρωση ενοικίασης
export const updateRental = async (rentalId, rentalData) => {
  try {
    const response = await apiClient.put(`/rentals/${rentalId}`, rentalData);
    return response.data;
  } catch (error) {
    console.error(`Σφάλμα κατά την ενημέρωση ενοικίασης ${rentalId}:`, error);
    throw error;
  }
};

// Διαγραφή ενοικίασης
export const deleteRental = async (rentalId) => {
  try {
    const response = await apiClient.delete(`/rentals/${rentalId}`);
    return response.data;
  } catch (error) {
    console.error(`Σφάλμα κατά την διαγραφή ενοικίασης ${rentalId}:`, error);
    throw error;
  }
};

// --- Βοηθητικές Συναρτήσεις για Φόρμες ---

// Λήψη ενός σκούτερ με βάση το ID
export const fetchScooter = async (scooterId) => {
  try {
    const response = await apiClient.get(`/scooters/${scooterId}`);
    return response.data;
  } catch (error) {
    console.error(`Σφάλμα κατά την λήψη του σκού��ερ ${scooterId}:`, error);
    throw error;
  }
};

// Λήψη ενός πελάτη με βάση το ID
export const fetchCustomer = async (customerId) => {
  try {
    const response = await apiClient.get(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Σφάλμα κατά την λήψη του πελάτη ${customerId}:`, error);
    throw error;
  }
};


// Λήψη διαθέσιμων σκούτερ για ενοικίαση
// Λήψη διαθέσιμων σκούτερ για ενοικίαση
export const getAvailableScooters = async () => {
  try {
    const response = await apiClient.get(
      '/scooters/?available_only=true&limit=1000');
    return response.data;
  } catch (error) {
  console.error('Σφάλμα κατά την λήψη διαθέσιμων σκούτερ:', error);
    throw error;
  }
};

// Λήψη όλων των πελατών
export const getCustomers = async () => {
  try {
    const response = await apiClient.get('/customers/');
    return response.data;
  } catch (error) {
    console.error('Σφάλμα κατά την λήψη πελατών:', error);
    throw error;
  }
};

// --- Οικονομικές Συναρτήσεις ---

// Υπολογισμός συνολικού κόστους με βάση τις ημερομηνίες
export const calculateRentalCost = (startDate, endDate, dailyRate = 20) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) return 0; // Αποφυγή αρνητικών τιμών

  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return daysDiff > 0 ? (daysDiff * dailyRate).toFixed(2) : 0;
};

// Λήψη εσόδων από ενοικιάσεις
export const getRentalIncome = async () => {
  try {
    const rentals = await fetchRentals();
    const income = rentals
      .filter(r => r.status === 'Ολοκληρωμένη' || r.status === 'Ενεργή') // Συνυπολογισμός και ��νεργών
      .reduce((sum, r) => sum + (r.total_price || 0), 0);
    return income;
  } catch (error) {
    console.error('Σφάλμα κατά τον υπολογισμό εσόδων από ενοικιάσεις:', error);
    throw error;
  }
};
