import axios from 'axios';


// Create axios instance with base config
const apiClient = axios.create({
  baseURL: 'http://localhost:5224', // Replace with your actual API base URL
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    // Something happened in setting up the request
    return Promise.reject(new Error('Request configuration error.'));
  }
);

// Auth API endpoints (no refresh token)
export const authApi = {
  loginAdmin: (credentials) => apiClient.post('/api/user/login', credentials),
  loginStaff: (credentials) => apiClient.post('/api/user/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => 
    apiClient.post('/auth/reset-password', { token, newPassword }),
};

// Staff API endpoints
export const staffApi = {
  getStaffList: () => apiClient.get('/api/admin'),
  createStaff: (staffData) => apiClient.post('/api/admin/staffregister', staffData),
  updateStaffStatus: (staffId, statusData) => 
    apiClient.put(`/api/admin/suspendstaff/${staffId}`, statusData),
};

// Patient API endpoints
export const patientApi = {
  getPatientQueue: () => apiClient.get('/api/queue'),
  registerPatient: (patientData) => apiClient.post('/api/reception/registerpatient', patientData),
  getPatientHistory: (patientId) => apiClient.get(`/patients/${patientId}/history`),
  // Doctor-specific endpoints
  getDoctorStats: () => apiClient.get('/patients/stats/doctor'),
  saveDiagnosis: (diagnosisData) => apiClient.post('/api/doctor/medicalRecord', diagnosisData),
  assignPatient: (combinedIds) => 
    apiClient.patch('/api/doctor/assignDoctor',combinedIds),
};

// Dashboard API endpoints
export const dashboardApi = {
  getDoctorStats: (staffId) => apiClient.get(`/api/patientStatus/doctor/${staffId}`),
  getReceptionStats: () => apiClient.get('/api/patientStatus/daily'),
  getRecentPatients: () => apiClient.get('/api/patientStatus/weekly'),
  getProcurementStats: () => apiClient.get('/dashboard/procurement'),
};

// Geting user profiles to display in the dashboard
export const userApi = {
  getCurrentUser:()=> apiClient.get('/api/user'),
   
  };

// Inventory API endpoints for meds in the procurement department
export const inventoryApi = {
  getInventory: () => apiClient.get('/inventory'),
  updateInventory: (itemId, updateData) => 
    apiClient.patch(`/inventory/${itemId}`, updateData),
  getMedications: () => apiClient.get('/inventory/medications'),
  updateMedication: (medId, updateData) =>
    apiClient.patch(`/inventory/medications/${medId}`, updateData),
};

// Chat API endpoints
export const chatApi = {
  sendMessage: (messageData) => apiClient.post('/api/chat', messageData),
  getHistory: () => apiClient.get('/chat/history'),
  getContextHistory: (context) => apiClient.get(`/chat/history/${context}`),
};



// Export the base client for custom requests
export default apiClient;