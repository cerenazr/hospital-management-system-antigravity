class CreateInitialSchema < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :full_name
      t.string :role, null: false # admin, doctor, patient
      t.timestamps
    end

    create_table :departments do |t|
      t.string :name, null: false
      t.text :description
      t.timestamps
    end

    create_table :doctors do |t|
      t.references :user, null: false, foreign_key: true
      t.references :department, null: false, foreign_key: true
      t.string :title
      t.text :bio
      t.timestamps
    end

    create_table :patients do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date_of_birth
      t.string :gender
      t.string :phone
      t.timestamps
    end

    create_table :appointment_slots do |t|
      t.references :doctor, null: false, foreign_key: true
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.boolean :is_booked, default: false
      t.timestamps
    end

    create_table :appointments do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :doctor, null: false, foreign_key: true
      t.references :appointment_slot, null: false, foreign_key: true
      t.string :status, default: 'scheduled' # scheduled, completed, cancelled
      t.text :notes
      t.timestamps
    end
  end
end
