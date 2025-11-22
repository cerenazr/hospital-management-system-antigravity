import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Department, Doctor, AppointmentSlot } from '../types';

export const BookAppointment: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [slots, setSlots] = useState<AppointmentSlot[]>([]);

    const [selectedDept, setSelectedDept] = useState<number | ''>('');
    const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('');

    const navigate = useNavigate();

    useEffect(() => {
        api.get('/departments').then(res => setDepartments(res.data));
    }, []);

    useEffect(() => {
        if (selectedDept) {
            api.get(`/doctors?department_id=${selectedDept}`).then(res => setDoctors(res.data));
        } else {
            setDoctors([]);
        }
        setSelectedDoctor('');
        setSlots([]);
    }, [selectedDept]);

    useEffect(() => {
        if (selectedDoctor) {
            api.get(`/doctors/${selectedDoctor}/slots`).then(res => setSlots(res.data));
        } else {
            setSlots([]);
        }
    }, [selectedDoctor]);

    const handleBook = async (slotId: number) => {
        try {
            await api.post('/appointments', {
                doctor_id: selectedDoctor,
                appointment_slot_id: slotId
            });
            alert('Appointment booked successfully!');
            navigate('/patient/appointments');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to book');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Select Department</label>
                <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    data-cy="dept-select"
                >
                    <option value="">-- Choose Department --</option>
                    {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>

            {selectedDept && (
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Select Doctor</label>
                    <select
                        value={selectedDoctor}
                        onChange={e => setSelectedDoctor(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        data-cy="doctor-select"
                    >
                        <option value="">-- Choose Doctor --</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.full_name} ({d.title})</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedDoctor && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Available Slots</h3>
                    {slots.length === 0 ? (
                        <p>No available slots.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {slots.filter(s => !s.is_booked).map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => handleBook(s.id)}
                                    className="p-4 border rounded hover:bg-indigo-50 text-indigo-700 font-medium"
                                    data-cy={`slot-${s.id}`}
                                >
                                    {new Date(s.start_time).toLocaleString()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
