class AppointmentsController < ApplicationController
  def create
    slot = AppointmentSlot.find(params[:appointment_slot_id])
    
    if slot.is_booked
      return render json: { error: 'Slot is already booked' }, status: :unprocessable_entity
    end

    appointment = Appointment.new(
      patient: current_user.patient,
      doctor_id: params[:doctor_id],
      appointment_slot: slot,
      status: 'scheduled',
      notes: params[:notes]
    )

    if appointment.save
      slot.update(is_booked: true)
      render json: appointment, status: :created
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def mine
    render json: current_user.patient.appointments.includes(:doctor, :appointment_slot)
  end

  def doctor_index
    # Assuming current_user is a doctor
    render json: current_user.doctor.appointments.includes(:patient, :appointment_slot)
  end

  def cancel
    appointment = current_user.patient.appointments.find(params[:id])
    if appointment.update(status: 'cancelled')
      appointment.appointment_slot.update(is_booked: false)
      render json: appointment
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def status
    # Doctor only
    appointment = current_user.doctor.appointments.find(params[:id])
    if appointment.update(status: params[:status])
      render json: appointment
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
