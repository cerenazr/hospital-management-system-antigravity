class Patient < ApplicationRecord
  belongs_to :user
  has_many :appointments
  delegate :full_name, to: :user
end
