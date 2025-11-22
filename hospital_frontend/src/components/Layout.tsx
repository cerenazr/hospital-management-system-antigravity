import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-indigo-600">HospitalApp</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">Welcome, {user.full_name} ({user.role})</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-red-600 hover:text-red-800"
                                        data-cy="logout-btn"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                                    <Link to="/register" className="text-gray-700 hover:text-indigo-600">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};
