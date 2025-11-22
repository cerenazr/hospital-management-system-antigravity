import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            login(token, user);

            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'doctor') navigate('/doctor');
            else navigate('/patient');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            {error && <div className="mb-4 text-red-600" data-cy="login-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        data-cy="email-input"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        data-cy="password-input"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                    data-cy="login-submit"
                >
                    Login
                </button>
            </form>
        </div>
    );
};
