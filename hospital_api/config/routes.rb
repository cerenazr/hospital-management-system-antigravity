Rails.application.routes.draw do
  # Auth
  post '/auth/register', to: 'auth#register'
  post '/auth/login', to: 'auth#login'
  get '/auth/me', to: 'auth#me'

  # Admin
  resources :departments
  resources :doctors, only: [:index, :show, :create, :update, :destroy]

  # Patient
  namespace :patients do
    get 'me', to: 'profiles#show'
    put 'me', to: 'profiles#update'
  end

  # Slots
  get '/doctors/:doctor_id/slots', to: 'appointment_slots#index'
  post '/doctors/:doctor_id/slots', to: 'appointment_slots#create'
  put '/slots/:id', to: 'appointment_slots#update'
  delete '/slots/:id', to: 'appointment_slots#destroy'

  # Appointments
  resources :appointments, only: [:create] do
    collection do
      get 'mine'   # for patients
      get 'doctor' # for doctors
    end
    member do
      put 'cancel' # for patients
      put 'status' # for doctors
    end
  end
end
