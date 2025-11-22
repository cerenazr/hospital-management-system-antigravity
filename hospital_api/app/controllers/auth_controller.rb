class AuthController < ApplicationController
  skip_before_action :authenticate_request

  def register
    user = User.new(user_params)
    user.role = 'patient'
    
    if user.save
      # Create patient profile
      Patient.create!(
        user: user,
        date_of_birth: params[:date_of_birth],
        gender: params[:gender],
        phone: params[:phone]
      )
      render json: { message: 'User created successfully' }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = jwt_encode(user_id: user.id)
      render json: { token: token, user: user }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.permit(:email, :password, :full_name)
  end

  def jwt_encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, Rails.application.secrets.secret_key_base)
  end
end
