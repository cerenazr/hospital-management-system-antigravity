import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Appointment } from '../types';

export const MyAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/appointments/mine');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = async (id: number) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.put(`/appointments/${id}/cancel`);
            fetchData();
        } catch (err) {
            alert('Failed to cancel');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
            <div className="space-y-4">
                {appointments.length === 0 && <p>No appointments found.</p>}
                {appointments.map(app => (
                    <div key={app.id} className="border p-4 rounded shadow-sm bg-white flex justify-between items-center" data-cy="appointment-card">
                        <div>
                            <p className="font-bold text-lg">{app.doctor_name || 'Doctor'}</p>
                            <p className="text-gray-600">{app.department_name || 'Department'}</p>
                            <p className="text-indigo-600 font-medium">{new Date(app.slot_time || '').toLocaleString()}</p>
                            <p className={`text-sm mt-1 ${app.status === 'scheduled' ? 'text-green-600' : 'text-red-600'}`}>
                                Status: {app.status.toUpperCase()}
                            </p>
                        </div>
                        {app.status === 'scheduled' && (
                            <button
                                onClick={() => handleCancel(app.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
