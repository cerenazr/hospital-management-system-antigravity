class AppointmentSlot < ApplicationRecord
  belongs_to :doctor
  has_one :appointment
  validates :start_time, :end_time, presence: true
end
