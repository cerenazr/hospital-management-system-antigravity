import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { BookAppointment } from './pages/BookAppointment';
import { MyAppointments } from './pages/MyAppointments';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/login" replace />} />

                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>

                        {/* Doctor Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                            <Route path="/doctor" element={<DoctorDashboard />} />
                        </Route>

                        {/* Patient Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                            <Route path="/patient" element={<PatientDashboard />} />
                            <Route path="/patient/book" element={<BookAppointment />} />
                            <Route path="/patient/appointments" element={<MyAppointments />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
