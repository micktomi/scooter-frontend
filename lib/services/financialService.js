import axios from 'axios';
import { apiClient } from './api';

// Base paths for API
const FINANCIAL_URL = '/financial';
const TRANSACTIONS_URL = '/transactions';
const EXPENSES_URL = '/transactions/expenses';

// Βασικό URL για τα οικονομικά endpoints

// Λήψη της οικονομικής σύνοψης
export const getFinancialSummary = async (startDate = null, endDate = null) => {
  try {
    let url = `${FINANCIAL_URL}/summary/`;
    
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    throw error;
  }
};

// Λήψη της ανάλυσης εσόδων
export const getIncomeAnalysis = async (startDate = null, endDate = null) => {
  try {
    let url = `${FINANCIAL_URL}/income/`;
    
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching income analysis:', error);
    throw error;
  }
};

// Λήψη της ανάλυσης εξόδων
export const getExpenseAnalysis = async (startDate = null, endDate = null) => {
  try {
    let url = `${FINANCIAL_URL}/expenses/`;
    
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching expense analysis:', error);
    throw error;
  }
};

// Λήψη μηνιαίας σύνοψης
export const getMonthlyAnalysis = async (startDate = null, endDate = null) => {
  try {
    let url = `${FINANCIAL_URL}/monthly/`;
    
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly analysis:', error);
    throw error;
  }
};

// Λήψη συναλλαγών με φίλτρα
export const getTransactions = async ({
  type = null,
  category = null,
  startDate = null,
  endDate = null,
  skip = 0,
  limit = 100
}) => {
  try {
    const params = { skip, limit };
    if (type) params.type = type;
    if (category) params.category = category;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get(TRANSACTIONS_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Προσθήκη νέας συναλλαγής εσόδων
export const addIncomeTransaction = async (transactionData) => {
  try {
    const data = {
      ...transactionData,
      type: 'income'
    };
    
    const response = await apiClient.post(TRANSACTIONS_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error adding income transaction:', error);
    throw error;
  }
};

// Προσθήκη νέας συναλλαγής εξόδων
export const addExpense = async (expenseData) => {
  try {
    const response = await apiClient.post(EXPENSES_URL, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

// Διαγραφή συναλλαγής
export const deleteTransaction = async (transactionId) => {
  try {
    const response = await apiClient.delete(`${TRANSACTIONS_URL}/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Ενημέρωση συναλλαγής
export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const response = await apiClient.put(`${TRANSACTIONS_URL}/${transactionId}`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};
