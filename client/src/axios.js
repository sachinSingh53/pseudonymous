// src/axios.js

import axios from 'axios';

// Create an instance of axios with default settings
const instance = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // Replace with your API base URL
  timeout: 10000, // Request timeout (optional)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, add interceptors to handle requests or responses
instance.interceptors.request.use(
  config => {
    // Modify or log request before sending
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    // Handle responses globally (e.g., logging, or redirect on 401)
    return response;
  },
  error => {
    // Handle errors globally (e.g., show a message for 500 errors)
    if (error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default instance;
