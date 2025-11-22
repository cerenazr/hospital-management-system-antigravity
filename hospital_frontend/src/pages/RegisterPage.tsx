import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('Male');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', {
                email,
                password,
                full_name: fullName,
                date_of_birth: dob,
                gender,
                phone
            });
            navigate('/login');
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Register Patient</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        data-cy="fullname-input"
                    />
                </div>
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
                <div className="mb-4">
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
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        data-cy="dob-input"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-2 border rounded"
                        data-cy="gender-select"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        data-cy="phone-input"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                    data-cy="register-submit"
                >
                    Register
                </button>
            </form>
        </div>
    );
};
