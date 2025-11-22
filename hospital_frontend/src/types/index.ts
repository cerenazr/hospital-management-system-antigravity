export type Role = 'admin' | 'doctor' | 'patient';

export interface User {
    id: number;
    email: string;
    full_name: string;
    role: Role;
}

export interface Department {
    id: number;
    name: string;
    description?: string;
}

export interface Doctor {
    id: number;
    user_id: number;
    department_id: number;
    title: string;
    bio: string;
    full_name: string; // from user
    department?: Department;
}

export interface Patient {
    id: number;
    user_id: number;
    date_of_birth: string;
    gender: string;
    phone: string;
    full_name: string;
}

export interface AppointmentSlot {
    id: number;
    doctor_id: number;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

export interface Appointment {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_slot_id: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    doctor_name?: string;
    department_name?: string;
    slot_time?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
