import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import LandingPage from '/src/pages/LandingPage/LandingPage.jsx';
import ProcurementPage from '/src/pages/ProcurementPage/Procurement.jsx';
import ReceptionistPage from '/src/pages/ReceptionistPage/Receptionist.jsx';
import DoctorPage from '/src/pages/DoctorPage/Doctor.jsx';
import AdminPage from '/src/pages/AdminPage/Admin.jsx';
import AdminLogin from '/src/pages/LoginPages/AdminLogin.jsx';
import StaffLogin from '/src/pages/LoginPages/StaffLogin.jsx';
import UnauthorizedPage from '././ui/Unauthorized.jsx';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      
        <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/stafflogin" element={<StaffLogin />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes */}
            
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/procurement" element={<ProcurementPage />} />
              <Route path="/reception" element={<ReceptionistPage />} />
              <Route path="/doctor" element={<DoctorPage />} />
              <Route path="*" element={<LandingPage />} />
          </Routes>
          </AuthProvider>
        </Router>
    </QueryClientProvider>
  );
}

export default App;