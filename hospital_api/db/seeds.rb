# Admin
admin = User.create!(
  email: 'admin@hospital.com',
  password: 'password',
  full_name: 'Super Admin',
  role: 'admin'
)

# Departments
cardio = Department.create!(name: 'Cardiology', description: 'Heart and vascular system')
derma = Department.create!(name: 'Dermatology', description: 'Skin, hair, and nails')

# Doctors
doc1_user = User.create!(email: 'doc1@hospital.com', password: 'password', full_name: 'Dr. Heart', role: 'doctor')
doc1 = Doctor.create!(user: doc1_user, department: cardio, title: 'Prof. Dr.', bio: 'Expert in hearts')

doc2_user = User.create!(email: 'doc2@hospital.com', password: 'password', full_name: 'Dr. Skin', role: 'doctor')
doc2 = Doctor.create!(user: doc2_user, department: derma, title: 'Uzm. Dr.', bio: 'Expert in skin')

# Patient
pat_user = User.create!(email: 'patient@hospital.com', password: 'password', full_name: 'John Doe', role: 'patient')
patient = Patient.create!(user: pat_user, date_of_birth: '1990-01-01', gender: 'Male', phone: '555-1234')

# Slots
[doc1, doc2].each do |doc|
  3.times do |i|
    start_time = (Date.today + 1.day).to_time + (9 + i).hours
    AppointmentSlot.create!(
      doctor: doc,
      start_time: start_time,
      end_time: start_time + 1.hour,
      is_booked: false
    )
  end
end

puts "Seeding done!"
