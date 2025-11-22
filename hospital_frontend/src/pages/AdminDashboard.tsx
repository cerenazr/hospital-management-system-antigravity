import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Department, Doctor } from '../types';

export const AdminDashboard: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [newDeptName, setNewDeptName] = useState('');
    const [newDocName, setNewDocName] = useState('');
    const [newDocEmail, setNewDocEmail] = useState('');
    const [newDocDeptId, setNewDocDeptId] = useState<number | ''>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [deptRes, docRes] = await Promise.all([
                api.get('/departments'),
                api.get('/doctors')
            ]);
            setDepartments(deptRes.data);
            setDoctors(docRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateDept = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.post('/departments', { name: newDeptName });
        setNewDeptName('');
        fetchData();
    };

    const handleCreateDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.post('/doctors', {
            full_name: newDocName,
            email: newDocEmail,
            department_id: newDocDeptId,
            password: 'password123', // default
            role: 'doctor',
            title: 'Dr.',
            bio: 'New doctor'
        });
        setNewDocName('');
        setNewDocEmail('');
        setNewDocDeptId('');
        fetchData();
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Departments</h2>
                    <ul className="mb-4 space-y-2">
                        {departments.map(d => (
                            <li key={d.id} className="border-b pb-2">{d.name}</li>
                        ))}
                    </ul>
                    <form onSubmit={handleCreateDept} className="flex gap-2">
                        <input
                            type="text"
                            value={newDeptName}
                            onChange={e => setNewDeptName(e.target.value)}
                            placeholder="New Department Name"
                            className="border p-2 rounded flex-1"
                            data-cy="dept-input"
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" data-cy="add-dept-btn">Add</button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Doctors</h2>
                    <ul className="mb-4 space-y-2">
                        {doctors.map(d => (
                            <li key={d.id} className="border-b pb-2">
                                {d.full_name} ({d.department?.name})
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleCreateDoctor} className="space-y-2">
                        <input
                            type="text"
                            value={newDocName}
                            onChange={e => setNewDocName(e.target.value)}
                            placeholder="Doctor Name"
                            className="border p-2 rounded w-full"
                            data-cy="doc-name-input"
                        />
                        <input
                            type="email"
                            value={newDocEmail}
                            onChange={e => setNewDocEmail(e.target.value)}
                            placeholder="Doctor Email"
                            className="border p-2 rounded w-full"
                            data-cy="doc-email-input"
                        />
                        <select
                            value={newDocDeptId}
                            onChange={e => setNewDocDeptId(Number(e.target.value))}
                            className="border p-2 rounded w-full"
                            data-cy="doc-dept-select"
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full" data-cy="add-doc-btn">Add Doctor</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
