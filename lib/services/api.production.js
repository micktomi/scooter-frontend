import axios from 'axios';

// Για περιβάλλον production στο Google Cloud
let API_URL = '';

// Χρήση του ίδιου origin για το API στο production περιβάλλον
if (window.location.hostname !== 'localhost') {
  // Υποθέτουμε ότι το backend λειτουργεί σε ένα υποδομαίνιο ή διαφορετικό URL
  API_URL = process.env.REACT_APP_API_URL || 'https://api-scooter-service.run.app';
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});