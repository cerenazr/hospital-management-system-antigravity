import React from 'react';
import { Link } from 'react-router-dom';

export const PatientDashboard: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/patient/book" className="block p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-200">
                    <h2 className="text-xl font-bold text-indigo-800 mb-2">Book Appointment</h2>
                    <p className="text-gray-600">Find a doctor and schedule a visit.</p>
                </Link>
                <Link to="/patient/appointments" className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition border border-green-200">
                    <h2 className="text-xl font-bold text-green-800 mb-2">My Appointments</h2>
                    <p className="text-gray-600">View and manage your scheduled visits.</p>
                </Link>
            </div>
        </div>
    );
};
