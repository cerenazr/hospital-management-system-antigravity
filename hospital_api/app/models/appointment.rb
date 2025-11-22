class Appointment < ApplicationRecord
  belongs_to :patient
  belongs_to :doctor
  belongs_to :appointment_slot
  enum :status, { scheduled: 'scheduled', completed: 'completed', cancelled: 'cancelled' }
  validate :slot_must_be_available, on: :create
  
  private
  def slot_must_be_available
    if appointment_slot.is_booked?
      errors.add(:appointment_slot, "is already booked")
    end
  end
end
