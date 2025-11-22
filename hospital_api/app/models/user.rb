class User < ApplicationRecord
  has_secure_password
  enum :role, { admin: 'admin', doctor: 'doctor', patient: 'patient' }
  has_one :doctor, dependent: :destroy
  has_one :patient, dependent: :destroy
  validates :email, presence: true, uniqueness: true
  validates :full_name, presence: true
end
