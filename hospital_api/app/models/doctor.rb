class Doctor < ApplicationRecord
  belongs_to :user
  belongs_to :department
  has_many :appointment_slots
  has_many :appointments
  delegate :full_name, to: :user
end
