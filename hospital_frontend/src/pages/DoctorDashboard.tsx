import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Appointment, AppointmentSlot, User } from '../types';
import { useAuth } from '../context/AuthContext';

export const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [slots, setSlots] = useState<AppointmentSlot[]>([]);
    const [newSlotTime, setNewSlotTime] = useState('');

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const appRes = await api.get('/appointments/doctor');
            setAppointments(appRes.data);

            // Assuming user.id maps to doctor_id for simplicity in this demo, 
            // or we fetch doctor profile first. In real app, we'd get doctor_id from /auth/me or similar.
            // For this demo, let's assume we can fetch slots by user_id or doctor_id.
            // We'll try to fetch slots for "me" or similar if API supported it, 
            // but here we might need the doctor ID.
            // Let's assume the backend handles "me" or we pass a dummy ID if we are mocking.
            const slotRes = await api.get(`/doctors/${user?.id}/slots`);
            setSlots(slotRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id: number, status: 'completed' | 'cancelled') => {
        await api.put(`/appointments/${id}/status`, { status });
        fetchData();
    };

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(newSlotTime);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

        await api.post(`/doctors/${user?.id}/slots`, {
            start_time: start.toISOString(),
            end_time: end.toISOString()
        });
        setNewSlotTime('');
        fetchData();
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
                    <ul className="space-y-4">
                        {appointments.map(app => (
                            <li key={app.id} className="border p-4 rounded flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">Patient ID: {app.patient_id}</p>
                                    <p className="text-sm text-gray-600">{new Date(app.slot_time || '').toLocaleString()}</p>
                                    <p className={`text-sm font-bold ${app.status === 'completed' ? 'text-green-600' : app.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
                                        {app.status.toUpperCase()}
                                    </p>
                                </div>
                                {app.status === 'scheduled' && (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'completed')}
                                            className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm"
                                            data-cy={`complete-btn-${app.id}`}
                                        >
                                            Complete
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'cancelled')}
                                            className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Manage Slots</h2>
                    <form onSubmit={handleCreateSlot} className="mb-6 flex gap-2">
                        <input
                            type="datetime-local"
                            value={newSlotTime}
                            onChange={e => setNewSlotTime(e.target.value)}
                            className="border p-2 rounded flex-1"
                            required
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Add Slot</button>
                    </form>

                    <h3 className="font-semibold mb-2">Available Slots</h3>
                    <ul className="space-y-2">
                        {slots.filter(s => !s.is_booked).map(s => (
                            <li key={s.id} className="text-sm border-b pb-1">
                                {new Date(s.start_time).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
